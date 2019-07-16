import {WebmateAuthInfo} from "./webmate-auth-info";
import {WebmateEnvironment} from "./webmate-environment";
import {JobEngine} from "./jobs/job-engine";
import {BrowserSessionClient} from "./browsersession/browser-session-client";
import {TestmgmtClient} from "./testmgmt/testmgmt-client";

export class WebmateAPISession {

    public jobEngine: JobEngine;
    public browserSession: BrowserSessionClient;
    public testmgmt: TestmgmtClient;

    constructor(public authInfo: WebmateAuthInfo, public environment: WebmateEnvironment) {
        this.jobEngine = new JobEngine(this);
        this.browserSession = new BrowserSessionClient(this);
        this.testmgmt = new TestmgmtClient(this);
    }
}
