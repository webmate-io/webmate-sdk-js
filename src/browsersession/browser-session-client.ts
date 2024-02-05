import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {BrowserSessionId, BrowserSessionStateId} from "../types";
import {BrowserSessionStateExtractionConfig} from "./browser-session-state-extraction-config";
import {Map} from 'immutable';
import {Observable} from "rxjs";
import {BrowserSessionScreenshotExtractionConfig} from "./browser-session-screenshot-extraction-config";
import {FinishStoryActionAddArtifactData} from "./finish-story-action-add-artifact-data";
import {v4 as uuid} from 'uuid';
import {StartStoryActionAddArtifactData} from "./start-story-action-add-artifact-data";
import {tap} from "rxjs/operators";
import {BrowserSessionRef} from "./browser-session-ref";
import {BrowserSessionInfo} from "./browser-session-info";

const DefaultStateExtractionConfig = new BrowserSessionStateExtractionConfig(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    true,
    new BrowserSessionScreenshotExtractionConfig(false, false),
    undefined);

const DefaultBrowserSessionTimeoutMillis = 5 * 60 * 1000; // Default timeout: 5 minutes

/**
 * Facade to webmate's BrowserSession subsystem.
 */
export class BrowserSessionClient {
    private apiClient: BrowserSessionApiClient = new BrowserSessionApiClient(this.session.authInfo, this.session.environment);

    private currentSpanIdsStack = new Array<string>();

    /**
     * Creates a BrowserSessionClient based on a WebmateApiSession.
     *
     * @param session The WebmateApiSession the BrowserSessionClient is supposed to be based on
     */
    constructor(private session: WebmateAPISession) {}

    /**
     * Return the webmate BrowserSessionId for a given Selenium session running in webmate.
     *
     * @param opaqueSeleniumSessionIdString Selenium SessionId that can be obtained by calling WebDriver.getSessionId().toString().
     * @return BrowserSessionRef that can be used to interact with the BrowserSession
     */
    getBrowserSessionForSeleniumSession(opaqueSeleniumSessionIdString: string): BrowserSessionRef {
        // TODO
        // it seems that currently the BrowserSessionId is equal to the Selenium SessionId (which I would consider a bug)
        return new BrowserSessionRef(opaqueSeleniumSessionIdString, this.session);
    }

    /**
     * Create a new State for the given BrowserSession.
     *
     * @param browserSessionId BrowserSession, in which the state should be extracted.
     * @param matchingId Label for state (should be unique for BrowserSession, otherwise some tests could get confused).
     * @param browserSessionStateExtractionConfig configuration controlling the state extraction process. See {@link BrowserSessionStateExtractionConfig}.
     * @throws WebmateApiClientException if an error occurs while requesting state extraction or if the timeout is exceeded.
     */
    public createState(matchingId: string,
                       browserSessionId?: BrowserSessionId,
                       browserSessionStateExtractionConfig: BrowserSessionStateExtractionConfig = DefaultStateExtractionConfig): Observable<BrowserSessionStateId> {
        if (!browserSessionId) {
            let associatedExpeditions = this.session.getAssociatedExpeditions();
            if (associatedExpeditions.length != 1) {
                throw new Error("If createState is called without browsersession id, there must be only one " +
                    "BrowserSession associated with the API session (to be able to identify the correct one) " +
                    "but currently there are " + associatedExpeditions.length);
            }

            browserSessionId = associatedExpeditions[0];
        }

        return this.apiClient.createState(browserSessionId, matchingId, browserSessionStateExtractionConfig);
    }

    // TODO missing withAction functions

    public startAction(actionName: string): Observable<void> {
        let expeditionId = this.session.getOnlyAssociatedExpedition();
        let spanId = uuid();
        let artifactData = new StartStoryActionAddArtifactData(actionName, spanId);
        return this.apiClient.startAction(expeditionId, artifactData).pipe(tap(() => {
            this.currentSpanIdsStack.push(spanId);
        }));
    }

    public finishAction(successMessage?: string): Observable<void> {
        let expeditionId = this.session.getOnlyAssociatedExpedition();
        if (this.currentSpanIdsStack.length <= 0) {
            throw new Error("Trying to finish action but none is active.");
        }
        let spanId = this.currentSpanIdsStack.pop() as string;
        return this.apiClient.finishAction(expeditionId, FinishStoryActionAddArtifactData.successful(spanId, successMessage));
    }

    public finishActionAsFailure(errorMessage: string): Observable<void> {
        let expeditionId = this.session.getOnlyAssociatedExpedition();
        if (this.currentSpanIdsStack.length <= 0) {
            throw new Error("Trying to finish action but none is active.");
        }
        let spanId = this.currentSpanIdsStack.pop() as string;
        return this.apiClient.finishAction(expeditionId, FinishStoryActionAddArtifactData.failure(spanId, errorMessage));
    }

    // TODO missing other functions

    /**
     * Terminate the given BrowserSession.
     *
     * @param browserSessionId The Id for the BrowserSession that is supposed to be terminated
     * @return true if the Browsersession was successfully terminated
     */
    public terminateBrowsersession(browserSessionId: BrowserSessionId): Observable<boolean> {
        return this.apiClient.terminateSession(browserSessionId);
    }

    /**
     * Retrieves the browser session info for a given browser session.
     *
     * @param id The id of the browser session whose browser session info should be retrieved.
     * @return   The browser session info for the given browser session.
     */
    public getBrowserSessionInfo(id: BrowserSessionId): Observable<BrowserSessionInfo> {
        return this.apiClient.getBrowserSessionInfo(id);
    }

}

class BrowserSessionApiClient extends WebmateAPIClient{

    createStateTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}/states");
    checkStateProgressTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}/artifacts/${browserSessionArtifactId}/progress");
    addArtifactTemplate: UriTemplate = new UriTemplate("/browsersession/${expeditionId}/artifacts");
    terminateBrowsersessionTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}");
    retrieveBrowserSessionInfoTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}/info");

    private millisToWait: number = 8000;

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    /**
     * Create new state artifact associated with browser session.
     *
     * @param browserSessionId id of browser session
     * @param matchingId "Name" of state
     * @param browserSessionStateExtractionConfig configuration controlling the state extraction process. See {@link BrowserSessionScreenshotExtractionConfig}.
     */
    public createState(browserSessionId: BrowserSessionId,
                       matchingId: string,
                       browserSessionStateExtractionConfig: BrowserSessionStateExtractionConfig = DefaultStateExtractionConfig): Observable<BrowserSessionStateId> {

        let params = Map({
            "browserSessionId": browserSessionId
        });
        let body = {
            "optMatchingId": matchingId,
            "extractionConfig": browserSessionStateExtractionConfig
        };
        return this.sendPOST(this.createStateTemplate, params, body);
    }

    public startAction(expeditionId: BrowserSessionId, art: StartStoryActionAddArtifactData): Observable<void> {
        let params = Map({
            "expeditionId": expeditionId
        });
        let body = art.asJson();
        return this.sendPOST(this.addArtifactTemplate, params, body);
    }

    public finishAction(expeditionId: BrowserSessionId, art: FinishStoryActionAddArtifactData): Observable<void> {
        let params = Map({
            "expeditionId": expeditionId
        });
        let body = art.asJson();
        return this.sendPOST(this.addArtifactTemplate, params, body);
    }

    /**
     * Tries to terminate a Browsersession. Will return whether the process was successful or not.
     *
     * @param browserSessionId The id of the session that should be terminated
     * @return true, if the Browersession was terminated successfully.
     */
    public terminateSession(browserSessionId: BrowserSessionId): Observable<boolean> {
        let params = Map({
            browserSessionId: browserSessionId
        });
        let queryParams  = Map({
            undefined: "terminate"
        });
        let body = {};

        return this.sendPOST(this.terminateBrowsersessionTemplate, params, body, queryParams);
    }

    public getBrowserSessionInfo(id: BrowserSessionId): Observable<BrowserSessionInfo> {
        return this.sendGET(this.retrieveBrowserSessionInfoTemplate, Map({"browserSessionId": id}));
    }

}
