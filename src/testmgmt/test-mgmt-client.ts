import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {ProjectId, TestResultId, TestRunId} from "../types";
import {List, Map} from "immutable";
import {Observable, from as observableFrom} from "rxjs";
import {map} from "rxjs/operators";
import {TestInfo} from "./test-info";
import {TestId} from "./testmgmt-types";
import {Test} from "./test";
import {TestResult} from "./test-result";

/**
 * Facade of the webmate TestMgmt subsystem, which provides access to information about Tests, TestRuns and
 * TestResults.
 */
export class TestMgmtClient {
    private apiClient: TestMgmtApiClient = new TestMgmtApiClient(this.session.authInfo, this.session.environment);

    /**
     * Creates a TestMgmtClient based on a WebmateApiSession
     * @param session The WebmateApiSession used by the TestMgmtClient
     */
    constructor(private session: WebmateAPISession) {
    }

    /**
     * Retrieve Tests in project with id
     * @param projectId
     * @return Test
     */
    getTestsInProject(projectId: ProjectId): Observable<List<TestInfo>> {
        return this.apiClient.getTestsInProject(projectId).pipe(map((infos => List(infos))));
    }

    /**
     * Retrieve Test with id
     * @param testId Id of Test.
     * @return Test
     */
    getTest(testId: TestId): Observable<Test> {
        return this.apiClient.getTest(testId);
    }

    /**
     * Retrieve list of TestResults for given test and test run.
     * @param testRunId Id of TestRun.
     * @return List of TestResults
     */
    getTestResults(testRunId: TestRunId): Observable<List<TestResult>> {
        return this.apiClient.getTestResults(testRunId).pipe(map(result => {
           return List(result);
        }));
    }

}

class TestMgmtApiClient extends WebmateAPIClient {
    private getTestsInProjectTemplate = new UriTemplate("/projects/${projectId}/testmgmt/tests");

    private getTestTemplate = new UriTemplate("/testmgmt/tests/${testId}");

    private getTestResultsTemplate = new UriTemplate("/testmgmt/testruns/${testRunId}/results");

    private createTagRuleTemplate = new UriTemplate("/projects/${projectId}/testmgmt/testresult-tagrules");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    getTestsInProject(projectId: ProjectId): Observable<TestInfo[]> {
        let params = Map({
            "projectId": projectId
        });
        return this.sendGET(this.getTestsInProjectTemplate, params);
    }

    getTest(testId: TestId): Observable<Test> {
        let params = Map({
            "testId": testId
        });
        return this.sendGET(this.getTestTemplate, params);
    }

    getTestResults(testRunId: TestRunId): Observable<TestResult[]> {
        let params = Map({
           "testRunId": testRunId
        });
        return this.sendGET(this.getTestResultsTemplate, params).pipe(map(r => r.value));
    }

}

// class SingleTestRunCreationSpec {
//     private type = "SingleTestRunCreationSpec";
//     constructor(private assignmentSpec: ) {
//     }
// }
