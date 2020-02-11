import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAPISession} from "../webmate-api-session";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {ProjectId, TestRunId} from "../types";
import {Map} from "immutable";
import {TestMail, TestMailAddress} from "./mail-test-types";
import {combineLatest, Observable, of} from "rxjs";
import {map, mergeMap, tap} from "rxjs/operators";
import {ArtifactType} from "../artifact/artifact-types";

export class MailTestClient {

    private apiClient: MailTestApiClient = new MailTestApiClient(this.session.authInfo, this.session.environment);
    private testMailAddress: TestMailAddress = "1231d12dasd@betatestmails.webmate.io";

    constructor(private session: WebmateAPISession) {}

    public createTestMailAddress(projectId: ProjectId, testRunId: TestRunId): Observable<TestMailAddress> {
        return this.apiClient.createTestMailAddressInProject(projectId, testRunId).pipe(tap(address => this.testMailAddress = address));
    }

    public getMailsInTestRun(projectId: ProjectId, testRunId: TestRunId): Observable<Array<TestMail>> {
        return this.session.artifact.queryArtifacts(projectId, [ArtifactType.fromString("Mail.MailContent")], testRunId, undefined)
            .pipe(mergeMap(arr => arr.length == 0 ? of([]) : combineLatest(arr.map(info => this.session.artifact.getArtifact(info.id).pipe(map(a => TestMail.fromArtifact(a)))))))
    }

}

export class MailTestApiClient extends WebmateAPIClient {

    private createTestMailAddressInProjectTemplate = new UriTemplate("/mailtest/testmail/${projectId}");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public createTestMailAddressInProject(projectId: ProjectId, testRunId: TestRunId): Observable<TestMailAddress> {
        return this.sendPOST(this.createTestMailAddressInProjectTemplate, Map({"projectId": projectId}), {testRunId: testRunId});
    }

}
