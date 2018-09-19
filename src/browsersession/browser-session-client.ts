import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {BrowserSessionId} from "../types";
import {BrowserSessionStateExtractionConfig} from "./browser-session-state-extraction-config";
const sleep = require('util').promisify(setTimeout);


export class BrowserSessionClient {
    private apiClient: BrowserSessionApiClient = new BrowserSessionApiClient(this.session.authInfo, this.session.environment);


    constructor(private session: WebmateAPISession) {
    }

    public async createState(browserSessionId: BrowserSessionId, stateName: string, timeout: number = 5*60*1000,
                       config: BrowserSessionStateExtractionConfig = new BrowserSessionStateExtractionConfig(undefined)): Promise<boolean> {
        return await this.apiClient.createState(browserSessionId, stateName, timeout, config);
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

    public async createState(browserSessionId: BrowserSessionId, stateName: string, timeout: number = 5*60*1000,
                       config: BrowserSessionStateExtractionConfig = new BrowserSessionStateExtractionConfig(undefined)) {

        let params = new Map([
            ["browserSessionId", browserSessionId]
        ]);


        let body = {
            optMatchingId: stateName,
            extractionConfig: config
        };


        let response = this.sendPOST(this.createStateTemplate, params, body);
        return await this.waitForStateExtractionResponse(browserSessionId, timeout, response);
    }

    public async waitForStateExtractionResponse(browserSessionId: BrowserSessionId, timeout: number, response: Promise<any>): Promise<boolean> {
        let r = await response;

        let time = new Date().getTime();

        for (let id of r) {
            while(true) {
                let params = new Map([
                    ["browserSessionId", browserSessionId],
                    ["browserSessionArtifactId", id]
                ]);

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



}
