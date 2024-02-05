import {BrowserSessionId, BrowserSessionStateId} from "../types";
import {WebmateAPISession} from "../webmate-api-session";
import {BrowserSessionStateExtractionConfig} from "./browser-session-state-extraction-config";
import {Observable} from "rxjs";
import {BrowserSessionInfo} from "./browser-session-info";

export class BrowserSessionRef {

    constructor(public readonly browserSessionId: BrowserSessionId,
                public readonly session: WebmateAPISession) {}

    /**
     * Creates a State for a Browsersession with a matching id using a custom config.
     *
     * @param matchingId The Id for the state. Used for matching.
     * @param browserSessionStateExtractionConfig The custom config that is supposed to be used.
     */
    createState(matchingId: string, browserSessionStateExtractionConfig: BrowserSessionStateExtractionConfig): Observable<BrowserSessionStateId> {
        return this.session.browserSession.createState(matchingId, this.browserSessionId, browserSessionStateExtractionConfig);
    }

    /**
     * Start custom action with given name. If there is another action already active, this action will be a
     * child action of that one.
     */
    startAction(actionName: string): Observable<void> {
        return this.session.browserSession.startAction(actionName);
    }

    // TODO missing withAction functions

    /**
     * Finish the currently active custom action successfully with message.
     */
    finishAction(successMessage: string): Observable<void> {
        return this.session.browserSession.finishAction(successMessage);
    }

    /**
     * Finish the currently active custom action and mark as failed with the given message.
     */
    finishActionAsFailure(errorMessage: string): Observable<void> {
        return this.session.browserSession.finishActionAsFailure(errorMessage);
    }

    /**
     * Terminates the BrowserSession.
     *
     * @return true if the BrowserSession was successfully terminated
     */
    terminateSession(): Observable<boolean> {
        return this.session.browserSession.terminateBrowsersession(this.browserSessionId);
    }

    /**
     * Retrieves the browser session info for this browser session.
     *
     * @return The browser session info for this browser session.
     */
    public getBrowserSessionInfo(): Observable<BrowserSessionInfo> {
        return this.session.browserSession.getBrowserSessionInfo(this.browserSessionId);
    }

}
