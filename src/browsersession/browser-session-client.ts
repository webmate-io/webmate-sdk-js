import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {BrowserSessionId, BrowserSessionStateId} from "../types";
import {BrowserSessionStateExtractionConfig} from "./browser-session-state-extraction-config";
import {Map, Stack} from 'immutable';
import {defer, Observable} from "rxjs";
import {BrowserSessionScreenshotExtractionConfig} from "./browser-session-screenshot-extraction-config";
import {FinishStoryActionAddArtifactData} from "./finish-story-action-add-artifact-data";
import { v4 as uuid } from 'uuid';
import {StartStoryActionAddArtifactData} from "./StartStoryActionAddArtifactData";

const sleep = require('util').promisify(setTimeout);

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

export class BrowserSessionClient {
    private apiClient: BrowserSessionApiClient = new BrowserSessionApiClient(this.session.authInfo, this.session.environment);

    private currentSpanIdsStack = new Array<string>();

    /**
     * Creates a BrowserSessionClient based on a WebmateApiSession
     * @param session The WebmateApiSession the BrowserSessionClient is supposed to be based on
     */
    constructor(private session: WebmateAPISession) {
    }

    /**
     * Create a new State for the given BrowserSession.
     * @param browserSessionId BrowserSession, in which the state should be extracted.
     * @param stateName Label for state (should be unique for BrowserSession, otherwise some tests could get confused).
     * @param timeout Maximal amount of time to wait for the state extraction to complete in milliseconds. Defaults to 300000ms(5 min.)
     * @param browserSessionStateExtractionConfig configuration controlling the state extraction process. See {@link BrowserSessionStateExtractionConfig}.
     */
    public createState(browserSessionId: BrowserSessionId,
                       stateName: string,
                       timeout: number = DefaultBrowserSessionTimeoutMillis,
                       browserSessionStateExtractionConfig: BrowserSessionStateExtractionConfig = new BrowserSessionStateExtractionConfig(undefined)): Observable<BrowserSessionStateId> {
        return this.apiClient.createState(browserSessionId, stateName, timeout, browserSessionStateExtractionConfig);
    }

    /**
     * Create a new State for the BrowserSession registered in webmate session (there must be only one).
     *
     * @param matchingId Label for state (should be unique for BrowserSession, otherwise some tests could get confused).
     * @param timeoutMillis Maximal amount of time to wait for the state extraction to complete in milliseconds.
     * @param browserSessionStateExtractionConfig configuration controlling the state extraction process. See {@link BrowserSessionStateExtractionConfig}.
     * @throws Error if an error occurs while requesting state extraction or if the timeout is exceeded.
     */
    public createStateForCurrentWebmateSession(matchingId: string,
                                               timeoutMillis: number = DefaultBrowserSessionTimeoutMillis,
                                               browserSessionStateExtractionConfig: BrowserSessionStateExtractionConfig = DefaultStateExtractionConfig): Observable<BrowserSessionStateId> {
        let associatedExpeditions = this.session.getAssociatedExpeditions();
        if (associatedExpeditions.length != 1) {
            throw new Error("If createState is called without browsersession id, there must be only one " +
                "BrowserSession associated with the API session (to be able to identify the correct one) " +
                "but currently there are " + associatedExpeditions.length);
        }

        let browserSessionId = associatedExpeditions[0];
        return this.apiClient.createState(browserSessionId, matchingId, timeoutMillis, browserSessionStateExtractionConfig);
    }

    // TODO return type void?
    public startAction(actionName: string): void {
        let expeditionId = this.session.getOnlyAssociatedExpedition();
        let spanId = uuid();
        let artifactData = new StartStoryActionAddArtifactData(actionName, spanId);
        this.apiClient.startAction(expeditionId, artifactData);
        this.currentSpanIdsStack.push(spanId);
    }

    // TODO return type void?
    public finishAction(successMessage: String): void {
        let expeditionId = this.session.getOnlyAssociatedExpedition();
        if (this.currentSpanIdsStack.length <= 0) {
            throw new Error("Trying to finish action but none is active.");
        }
        let spanId = this.currentSpanIdsStack.pop() as string;
        this.apiClient.finishAction(expeditionId, FinishStoryActionAddArtifactData.successful(spanId, successMessage));
    }

    // TODO return type void?
    public finishActionAsFailure(errorMessage: string): void {
        let expeditionId = this.session.getOnlyAssociatedExpedition();
        if (this.currentSpanIdsStack.length <= 0) {
            throw new Error("Trying to finish action but none is active.");
        }
        let spanId = this.currentSpanIdsStack.pop() as string;
        this.apiClient.finishAction(expeditionId, FinishStoryActionAddArtifactData.failure(spanId, errorMessage));
    }

    /**
     * Terminate the given BrowserSession
     *
     * @param browserSessionId The Id for the BrowserSession that is supposed to be terminated
     * @return true if the Browsersession was successfully terminated
     */
    public terminateBrowsersession(browserSessionId: BrowserSessionId): Observable<boolean> {
        return this.apiClient.terminateSession(browserSessionId);
    }

}

class BrowserSessionApiClient extends WebmateAPIClient{
    createStateTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}/states");
    checkStateProgressTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}/artifacts/${browserSessionArtifactId}/progress");
    addArtifactTemplate: UriTemplate = new UriTemplate("/browsersession/${expeditionId}/artifacts");
    terminateBrowsersessionTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}");

    private millisToWait: number = 8000;

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    /**
     * Create new state artifact associated with browser session.
     *
     * @param browserSessionId id of browser session
     * @param matchingId "Name" of state
     * @param timeoutMillis time to wait for completion of operation (may still be successful after timeout)
     * @param browserSessionStateExtractionConfig configuration controlling the state extraction process. See {@link BrowserSessionScreenshotExtractionConfig}.
     */
    public createState(browserSessionId: BrowserSessionId,
                       matchingId: string,
                       timeoutMillis: number,
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
        })
        let body = art;
        return this.sendPOST(this.addArtifactTemplate, params, body)
    }

    public finishAction(expeditionId: BrowserSessionId, art: FinishStoryActionAddArtifactData): Observable<void> {
        let params = Map({
            "expeditionId": expeditionId
        });
        let body = art;
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

}
