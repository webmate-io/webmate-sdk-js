import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {ProjectId, TestResultId} from "../types";
import {List, Map} from "immutable";
import {Test, TestId, TestResult} from "./testmgmt-types";
import {Observable, from as observableFrom} from "rxjs";
import {map} from "rxjs/operators";

/**
 * Facade of the webmate TestMgmt subsystem, which provides access to information about Tests, TestRuns and
 * TestResults.
 */
export class TestmgmtClient {
    private apiClient: TestmgmtApiClient = new TestmgmtApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {

    }

    /**
     * Get a list of TestIds available in project.
     */
    getTestsInProject(projectId: ProjectId): Observable<List<TestId>> {
        return this.apiClient.getTestsInProject(projectId).pipe(map((ids => List(ids))));
    }

    getTest(testId: TestId): Observable<Test> {
        return this.apiClient.getTest(testId);
    }

    /**
     * Retrieve the test results for the given test and the test run with the given index.
     */
    getTestResults(testId: TestId, index: number): Observable<List<TestResult>> {
        return this.apiClient.getTestResults(testId, index).pipe(map(result => {
           return List(result);
        }));
    }

    createTagRule(projectId: ProjectId, query: string, target: any, testId?: TestId, startTestRunIndex?: number): Observable<any> {
        return this.apiClient.createTagRule(projectId, query, target, testId, startTestRunIndex);
    }

    createFilterRule(projectId: ProjectId, query: string, testId?: TestId, startTestRunIndex?: number): Observable<any> {
        return this.apiClient.createTagRule(projectId, query, [{filtered: true}], testId, startTestRunIndex);
    }

}

class TestmgmtApiClient extends WebmateAPIClient {
    private getTestsInProjectTemplate = new UriTemplate("/projects/${projectId}/testmgmt/tests");

    private getTestTemplate = new UriTemplate("/testmgmt/tests/${testId}");

    private getTestResultsTemplate = new UriTemplate("/testmgmt/tests/${testId}/testruns/${testRunIdx}/results");

    private createTagRuleTemplate = new UriTemplate("/projects/${projectId}/testmgmt/testresult-tagrules");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    getTestsInProject(projectId: ProjectId): Observable<TestId[]> {
        let params = Map({
            "projectId": projectId
        });
        return this.sendGET(this.getTestsInProjectTemplate, params);
    }

    getTest(testId: TestId): Observable<any> {
        let params = Map({
            "testId": testId
        });
        return this.sendGET(this.getTestTemplate, params);
    }

    getTestResults(testId: TestId, index: number): Observable<any[]> {
        let params = Map({
           "testId": testId,
           "testRunIdx": '' + index
        });
        return this.sendGET(this.getTestResultsTemplate, params);
    }

    createTagRule(projectId: ProjectId, query: string, target: any, testId?: TestId, startTestRunIndex?: number): Observable<any> {
        let params = Map({
            "projectId": projectId
        });

        let body = {
            testId: testId,
            startTestRunIdx: startTestRunIndex,
            query: query.trim(),
            target: target
        };

        if (testId) {
            body['testId'] = testId;
        }
        if (startTestRunIndex) {
            body['startTestRunIdx'] = startTestRunIndex;
        }

        console.log("HHHH");
        console.log(params);
        console.log(body);
        return this.sendPOST(this.createTagRuleTemplate, params, body);
    }
}
