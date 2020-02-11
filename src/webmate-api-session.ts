import {WebmateAuthInfo} from "./webmate-auth-info";
import {WebmateEnvironment} from "./webmate-environment";
import {JobEngine} from "./jobs/job-engine";
import {BrowserSessionClient} from "./browsersession/browser-session-client";
import {TestmgmtClient} from "./testmgmt/testmgmt-client";
import {DeviceClient} from "./device/device-client";
import {ArtifactClient} from "./artifact/artifact-client";
import {MailTestClient} from "./mailTest/mail-test-client";

export class WebmateAPISession {

    public jobEngine: JobEngine;
    public browserSession: BrowserSessionClient;
    public testmgmt: TestmgmtClient;
    public device: DeviceClient;
    public artifact: ArtifactClient;
    public mailTest: MailTestClient;

    constructor(public authInfo: WebmateAuthInfo, public environment: WebmateEnvironment) {
        this.jobEngine = new JobEngine(this);
        this.browserSession = new BrowserSessionClient(this);
        this.testmgmt = new TestmgmtClient(this);
        this.device = new DeviceClient(this);
        this.artifact = new ArtifactClient(this);
        this.mailTest = new MailTestClient(this);
    }
}
