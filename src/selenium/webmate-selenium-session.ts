import {SeleniumSessionProxy} from "./selenium-session-proxy";
import {SeleniumSession} from "./selenium-session";
import { BrowserSessionId, ProjectId, TestRunId, UserId, WebmateSeleniumSessionId } from "../types";
import {WebmateAPISession} from "../webmate-api-session";
import { Observable, of } from "rxjs";
import { first, flatMap, map, take } from "rxjs/operators";
import { Browser } from "../browser";
import { TestRun } from "../testmgmt/test-run";
import { TestRunEvaluationStatus } from "../testmgmt/test-run-evaluation-status";

class FromBrowserSessionProxy implements SeleniumSessionProxy {

    constructor(private readonly sessionId: BrowserSessionId, private readonly session: WebmateAPISession) {
    }

    getSession(): Observable<SeleniumSession> {
        return this.session.selenium.getSeleniumSessionForBrowserSession(this.sessionId);
    }

}

class FromWebmateSeleniumSessionProxy implements SeleniumSessionProxy {

    constructor(private readonly sessionId: WebmateSeleniumSessionId, private readonly session: WebmateAPISession) {
    }

    getSession(): Observable<SeleniumSession> {
        return this.session.selenium.getSeleniumsession(this.sessionId);
    }

}

export class WebmateSeleniumSession {

    private proxy: SeleniumSessionProxy
    private cachedValue?: SeleniumSession

    constructor(private readonly apiSession: WebmateAPISession,
                private readonly browserSessionId?: BrowserSessionId,
                private readonly seleniumSessionId?: WebmateSeleniumSessionId) {
        if (!!browserSessionId) {
            this.proxy = new FromBrowserSessionProxy(browserSessionId, apiSession);
        } else if (!!seleniumSessionId) {
            this.proxy = new FromWebmateSeleniumSessionProxy(seleniumSessionId, apiSession);
        } else {
            throw new Error('Neither browserSessionId nor seleniumSessionId was passed.')
        }
    }

    private fetchSessionData(refresh?: boolean): Observable<void> {
        if (!this.cachedValue || refresh) {
            return this.proxy.getSession().pipe(first(), map(session => {
                this.cachedValue = session;
            }));
        } else {
            return of();
        }
    }

    fetchSessionDataWithoutForcedRefresh(): Observable<void> {
        return this.fetchSessionData(false);
    }

    /**
     * Internal id of Selenium session in webmate.
     */
    getId(): Observable<WebmateSeleniumSessionId> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.id;
        }));
    }

    /**
     * UserId of user who has started the session.
     */
    getUserId(): Observable<UserId> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.userId;
        }));
    }

    /**
     * Browser used in the selenium session.
     */
    getBrowser(): Observable<Browser> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.browser;
        }));
    }

    /**
     * Was a proxy being used?
     */
    usingProxy(): Observable<boolean> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.usingProxy;
        }));
    }

    /**
     * State of the Selenium session. May be one of: created, requestingbusinesstransaction, requestingtickt, requestingsession,
     * waitingforsession, requestinglease, running, done, timeout, failed, canceled, invalid
     */
    getState(): Observable<string> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.state;
        }));
    }

    /**
     * Internal representation of the requested Selenium capabilities
     */
    getSeleniumCapabilities(): Observable<any> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.seleniumCapabilities;
        }));
    }

    /**
     * Project where the session was started.
     */
    getProjectId(): Observable<ProjectId> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.projectId;
        }));
    }

    /**
     * Id of BrowserSession / Expedition
     */
    getBrowserSessionId(): Observable<BrowserSessionId> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.browserSessionId;
        }));
    }

    /**
     * If this session has failed, return the error message or null otherwise.
     */
    getErrorMessage(): Observable<string> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(first(), map(_ => {
            return this.cachedValue!.errorMessage;
        }));
    }

    /**
     * Id of webmate TestRun associated with Selenium session.
     */
    getTestRunId(): Observable<TestRunId | undefined> {
        return this.fetchSessionDataWithoutForcedRefresh().pipe(
            flatMap(_ => {
                return this.getSeleniumCapabilities().pipe(first(), map( capabilities => {
                    return capabilities['testRunId'];
                }))
            })
        );
    }

    /**
     * Get TestRun associated with Selenium session or null if none is found.
     */
    getTestRun(): Observable<TestRun | undefined> {
        return this.getTestRunId().pipe(map(id => {
            if (!!id) {
                return new TestRun(id, this.apiSession);
            } else {
                return undefined;
            }
        }));
    }

    // TODO add here the missing method

}
