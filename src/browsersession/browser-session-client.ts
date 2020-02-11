import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {BrowserSessionId} from "../types";
import {BrowserSessionStateExtractionConfig} from "./browser-session-state-extraction-config";
import {Map} from 'immutable';
import {defer, Observable} from "rxjs";

const sleep = require('util').promisify(setTimeout);


export class BrowserSessionClient {
    private apiClient: BrowserSessionApiClient = new BrowserSessionApiClient(this.session.authInfo, this.session.environment);


    constructor(private session: WebmateAPISession) {
    }

    public createState(browserSessionId: BrowserSessionId, stateName: string, timeout: number = 5*60*1000,
                       config: BrowserSessionStateExtractionConfig = new BrowserSessionStateExtractionConfig(undefined)): Observable<boolean> {
        return this.apiClient.createState(browserSessionId, stateName, timeout, config);
    }

    public terminateSession(browserSessionId: BrowserSessionId): Observable<boolean> {
        return this.apiClient.terminateSession(browserSessionId);
    }

}

class BrowserSessionApiClient extends WebmateAPIClient{
    createStateTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}/states");
    checkStateProgressTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}/artifacts/${browserSessionArtifactId}/progress");
    terminateBrowsersessionTemplate: UriTemplate = new UriTemplate("/browsersession/${browserSessionId}");

    private millisToWait: number = 8000;

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public createState(browserSessionId: BrowserSessionId, stateName: string, timeout: number = 5*60*1000,
                       config: BrowserSessionStateExtractionConfig = new BrowserSessionStateExtractionConfig(undefined)): Observable<boolean> {

        let params = Map({
            "browserSessionId": browserSessionId
        });


        let body = {
            optMatchingId: stateName,
            extractionConfig: config
        };


        let response = this.sendPOST(this.createStateTemplate, params, body);
        return defer(() => this.waitForStateExtractionResponse(browserSessionId, timeout, response.toPromise()));
    }

    public async waitForStateExtractionResponse(browserSessionId: BrowserSessionId, timeout: number, response: Promise<any>): Promise<boolean> {
        let r = await response;

        let time = new Date().getTime();

        for (let id of r) {
            while(true) {
                let params = Map({
                    "browserSessionId": browserSessionId,
                    "browserSessionArtifactId": id
                });

                if (await this.sendGET(this.checkStateProgressTemplate, params)) {
                    break;
                } else if (new Date().getTime() >= time + timeout) {
                    return false;
                }

                await sleep(this.millisToWait);
            }
        }

        return true;
    }

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
