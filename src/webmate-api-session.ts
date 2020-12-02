import {WebmateAuthInfo} from "./webmate-auth-info";
import {WebmateEnvironment} from "./webmate-environment";
import {JobEngine} from "./jobs/job-engine";
import {BrowserSessionClient} from "./browsersession/browser-session-client";
import {TestmgmtClient} from "./testmgmt/testmgmt-client";
import {DeviceClient} from "./device/device-client";
import {ArtifactClient} from "./artifacts/artifact-client";
import {MailTestClient} from "./mailTest/mail-test-client";
import {BrowserSessionId} from "./types";

export class WebmateAPISession {

    public jobEngine: JobEngine;
    public browserSession: BrowserSessionClient;
    public device: DeviceClient;
    public testMgmt: TestmgmtClient;
    public mailTest: MailTestClient;
    public artifact: ArtifactClient;

    /**
     * Constructor to create a new WebmateAPISession.
     * The session is used to access all functionality of webmate.
     *
     * @param authInfo an instance of WebmateAuthInfo which contains the users credentials
     * @param environment an instance of WebmateEnvironment which contains the url of webmate
     */
    constructor(public authInfo: WebmateAuthInfo, public environment: WebmateEnvironment) {
        this.jobEngine = new JobEngine(this);
        this.browserSession = new BrowserSessionClient(this);
        this.testMgmt = new TestmgmtClient(this);
        this.device = new DeviceClient(this);
        this.artifact = new ArtifactClient(this);
        this.mailTest = new MailTestClient(this);
    }

    //////////////////////////////
    /// Mutable Session state
    ///////////////////////////////

    private associatedExpeditions: Array<BrowserSessionId> = [];

    /**
     * Associate BrowserSession with API session.
     */
    public addBrowserSession(id: BrowserSessionId): void {
        this.associatedExpeditions.push(id);
    }

    public getAssociatedExpeditions(): ReadonlyArray<BrowserSessionId> {
        return this.associatedExpeditions.map(e => e as BrowserSessionId);
    }

    /**
     * Check if there is only one associated Expedition / BrowserSession and return it.
     */
    public getOnlyAssociatedExpedition(): BrowserSessionId {
        if (this.associatedExpeditions.length != 1) {
            throw new Error("Expected exactly one active Expedition (e.g. BrowserSession) in WebmateSession, but there are " +
                this.associatedExpeditions.length);
        }
        return this.associatedExpeditions[0];
    }

    /**
     * Associate Selenium session with API session.
     */
    public addSeleniumSession(opaqueSeleniumSessionIdString: string): void {
    // currently the browsersession id is equivalent to the selenium session id (which is scary but comes
    // quite handy)
    this.addBrowserSession(opaqueSeleniumSessionIdString);
}

}
