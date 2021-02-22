import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {SeleniumSession} from "./selenium-session";
import {BrowserSessionId, ProjectId, WebmateSeleniumSessionId} from "../types";
import {SeleniumCapability} from "./selenium-capability";
import {List, Map} from "immutable";
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";

/**
 * Facade to webmate's Selenium subsystem.
 */
export class SeleniumServiceClient {

    private apiClient: SeleniumServiceApiClient = new SeleniumServiceApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {}

    /**
     * Get a Selenium session by ID.
     *
     * @param sessionId ID of the selenium session to retrieve
     * @return SeleniumSession with the requested session ID
     */
    getSeleniumsession(sessionId: WebmateSeleniumSessionId): Observable<SeleniumSession> {
        return this.apiClient.getSeleniumsession(sessionId);
    }

    /**
     * Get a Selenium session for browser session.
     *
     * @param browserSessionId ID of the browser session that is associated with the Selenium session to be returned.
     * @return SeleniumSession with the requested session ID
     */
    getSeleniumSessionForBrowserSession(browserSessionId: BrowserSessionId): Observable<SeleniumSession> {
        return this.apiClient.getSeleniumsessionForBrowserSession(browserSessionId);
    }

    /**
     * Get all Selenium capabilities for a project by project ID.
     *
     * @param projectId ID of the project of which the capabilities should be retrieved
     * @return List of all Selenium capabilities in the given project (Actual type: ArrayList)
     */
    getSeleniumCapabilitiesForProject(projectId: ProjectId): Observable<List<SeleniumCapability>> {
        return this.apiClient.getSeleniumCapabilitiesForProject(projectId);
    }

    /**
     * Get all Selenium sessions for a project by project ID.
     *
     * @param projectId The ID of the project of which Selenium sessions shall be retrieved
     * @param after (optional) An ID of a SeleniumSession, the call (and all of its other query parameters) will only take Sessions into account that were created after the Session with the given Id.
     * @param count (optional) The length of the output is restricted to the given integer, remaining (aka older) Sessions are not returned. Use of this parameter is highly recommended to avoid a gigantic result that needs to be send over the network.
     * @param state (optional) Only SeleniumSessions in the given state are considered and returned by the call, all other Sessions are filtered out.
     * @return (Filtered) List of Selenium sessions in the given project (Actual type: ArrayList)
     */
    getSeleniumsessionsForProject(projectId: ProjectId, after?: WebmateSeleniumSessionId, count?: number, state?: string): Observable<List<SeleniumSession>> {
        return this.apiClient.getSeleniumsessionsForProject(projectId, after, count, state);
    }

    /**
     * Get all Selenium session IDs for a project by project ID.
     *
     * @param projectId The ID of the project of which Selenium session IDs shall be retrieved
     * @param after (optional) An ID of a SeleniumSession, the call (and all of its other query parameters) will only take Sessions into account that were created after the Session with the given ID.
     * @param count (optional) The length of the output is restricted to the given integer, remaining (aka older) Sessions are not returned. Use of this parameter is highly recommended to avoid a gigantic result that needs to be send over the network.
     * @param state (optional) Only SeleniumSessions in the given state are considered and returned by the call, all other Sessions are filtered out.
     * @return (Filtered) List of Selenium session IDs in the given project (Actual type: ArrayList)
     */
    getSeleniumsessionIdsForProject(projectId: ProjectId, after?: WebmateSeleniumSessionId, count?: number, state?: string): Observable<List<WebmateSeleniumSessionId>> {
        return this.apiClient.getSeleniumsessionIdsForProject(projectId, after, count, state);
    }

    /**
     * Stop a Selenium session by ID.
     *
     * @param sessionId ID of the Selenium session to be stopped
     * @throws WebmateApiClientException if an HTTP error occurred or the Selenium session could not be found (e.g. due to missing permissions, or wrong ID)
     */
    stopSeleniumsession(sessionId: WebmateSeleniumSessionId): Observable<void> {
        return this.apiClient.stopSeleniumsession(sessionId);
    }

}

class SeleniumServiceApiClient extends WebmateAPIClient {

    private getSeleniumsessionTemplate = new UriTemplate('/seleniumsession/${sessionId}');
    private getSeleniumsessionForBrowserSessionTemplate = new UriTemplate('/seleniumsession/');
    private getSeleniumCapabilitiesForProjectTemplate = new UriTemplate('/projects/${projectId}/selenium/capabilities');
    private getSeleniumsessionsForProjectTemplate = new UriTemplate('/projects/${projectId}/seleniumsession');
    private getSeleniumsessionIdsForProjectTemplate = new UriTemplate('/projects/${projectId}/seleniumsession/id');
    private stopSeleniumsessionTemplate = new UriTemplate('/seleniumsession/${sessionId}/stop');

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    /**
     * Helper function to build a selenium session from json.
     */
    private buildSeleniumSessionFromJson(sessionJson: any): SeleniumSession {
        return new SeleniumSession(sessionJson.id,
            sessionJson.userId,
            sessionJson.browser,
            sessionJson.usingProxy,
            sessionJson.state,
            sessionJson.seleniumCapabilities,
            sessionJson.projectId,
            sessionJson.browserSessionId,
            sessionJson.errorMessage);
    }

    /**
     * Helper function to build a selenium capability from json.
     */
    private buildSeleniumCapabilityFromJson(capabilityJson: any): SeleniumCapability {
        return new SeleniumCapability(capabilityJson.browserName,
            capabilityJson.version,
            capabilityJson.platform,
            capabilityJson.supportsProxy,
            capabilityJson.browserLanguage);
    }

    getSeleniumsession(sessionId: WebmateSeleniumSessionId): Observable<SeleniumSession> {
        let params = Map({
            'sessionId': sessionId
        });
        return this.sendGET(this.getSeleniumsessionTemplate, params)
            .pipe(first(), map(resp => this.buildSeleniumSessionFromJson(resp)));
    }

    getSeleniumsessionForBrowserSession(browserSessionId: BrowserSessionId): Observable<SeleniumSession> {
        let queryparams = Map({
            'expeditionId': browserSessionId
        });

        return this.sendGET(this.getSeleniumsessionForBrowserSessionTemplate, Map({}), queryparams)
            .pipe(first(), map(resp => this.buildSeleniumSessionFromJson(resp)));
    }

    getSeleniumCapabilitiesForProject(projectId: ProjectId): Observable<List<SeleniumCapability>> {
        let params = Map({
            'projectId': projectId
        });
        return this.sendGET(this.getSeleniumCapabilitiesForProjectTemplate, params).pipe(map(capabilitiesJson => {
            return capabilitiesJson.map((capability: any) => this.buildSeleniumCapabilityFromJson(capability));
        }));
    }

    getSeleniumsessionsForProject(projectId: ProjectId, after?: WebmateSeleniumSessionId, count?: number, state?: string): Observable<List<SeleniumSession>> {
        let queryparams: any = {};
        if (!!after) {
            queryparams['after'] = after;
        }
        if (!!count) {
            queryparams['count'] = count;
        }
        if (!!state) {
            queryparams['state'] = state;
        }

        let params = Map({
           'projectId': projectId
        });
        return this.sendGET(this.getSeleniumsessionsForProjectTemplate, params, Map(queryparams)).pipe(map(sessionsJson => {
            return sessionsJson.map((session: any) => this.buildSeleniumSessionFromJson(session));
        }));
    }

    getSeleniumsessionIdsForProject(projectId: ProjectId, after?: WebmateSeleniumSessionId, count?: number, state?: string): Observable<List<WebmateSeleniumSessionId>> {
        let queryparams: any = {};
        if (!!after) {
            queryparams['after'] = after;
        }
        if (!!count) {
            queryparams['count'] = count;
        }
        if (!!state) {
            queryparams['state'] = state;
        }

        let params = Map({
            'projectId': projectId
        });
        return this.sendGET(this.getSeleniumsessionIdsForProjectTemplate, params, Map(queryparams)).pipe(map(sessionsJson => {
            return sessionsJson.map((session: any) => this.buildSeleniumSessionFromJson(session));
        }));
    }

    stopSeleniumsession(sessionId: WebmateSeleniumSessionId): Observable<void> {
        let params = Map({
            'sessionId': sessionId.toString()
        });
        return this.sendPOST(this.stopSeleniumsessionTemplate, params);
    }

}
