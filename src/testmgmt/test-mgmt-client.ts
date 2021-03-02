import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {ProjectId, TestRunId, TestId, TestSessionId, TestExecutionId} from "../types";
import {List, Map} from "immutable";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {Test} from "./test";
import {TestResult} from "./test-result";
import {CreateTestExecutionResponse} from "./create-test-execution-response";
import {WMValue} from "../jobs/wm-value";
import {TestExecutionSpec} from "./spec/test-execution-spec";
import {TestExecutionSummary} from "./test-execution-summary";
import {TestRunInfo} from "./test-run-info";
import {TestRunFinishData} from "./test-run-finish-data";
import {TestTemplate} from "./test-template";
import {TestSession} from "./test-session";
import {TestRunEvaluationStatus} from "./test-run-evaluation-status";
import {TestRun} from "./test-run";
import {TestExecutionSpecBuilder} from "./test-execution-spec-builder";

export class SingleTestRunCreationSpec {

    constructor(private readonly parameterAssignments: Map<string, WMValue>) {}

    asJson(): any {
        let parameterAssignmentsJson: any = {};
        this.parameterAssignments.keySeq().forEach(k => {
            if (!!k) {
                parameterAssignmentsJson[k] = this.parameterAssignments.get(k).asJson();
            }
        });
        return {
            'type': 'SingleTestRunCreationSpec',
            'assignmentSpec': parameterAssignmentsJson
        };
    }

}

/**
 * Facade of the webmate TestMgmt subsystem, which provides access to information about Tests, TestRuns and
 * TestResults.
 */
export class TestMgmtClient {

    private apiClient: TestMgmtApiClient = new TestMgmtApiClient(this.session.authInfo, this.session.environment);

    /**
     * Creates a TestMgmtClient based on a WebmateApiSession.
     *
     * @param session The WebmateApiSession used by the TestMgmtClient
     */
    constructor(private session: WebmateAPISession) {}

    getTestTemplates(projectId: ProjectId): Observable<TestTemplate[]> {
        return this.apiClient.getTestTemplates(projectId);
    }

    /**
     * Retrieve Test with id.
     *
     * @param testId Id of Test.
     * @return Test
     */
    getTest(testId: TestId): Observable<Test> {
        return this.apiClient.getTest(testId);
    }

    /**
     * Retrieve list of TestResults for given test and test run.
     *
     * @param testRunId Id of TestRun.
     * @return List of TestResults
     */
    getTestResults(testRunId: TestRunId): Observable<List<TestResult>> {
        return this.apiClient.getTestResults(testRunId).pipe(map(result => {
            return List(result);
        }));
    }

    /**
     * Retrieve information about TestRun.
     *
     * @param testRunId Id of TestRun.
     * @return TestRun information
     */
    getTestRun(testRunId: TestRunId): Observable<TestRunInfo> {
        return this.apiClient.getTestRun(testRunId);
    }

    /**
     * Get Id of TestRun associated with a Selenium session.
     *
     * @param opaqueSeleniumSessionIdString selenium session id
     * @return test run id
     */
    getTestRunIdForSessionId(opaqueSeleniumSessionIdString: string): Observable<TestRunId> {
        // TODO
        // TODO
        // TODO
        return of(opaqueSeleniumSessionIdString);
    }

    startExecution(spec: TestExecutionSpec, projectId: ProjectId): Observable<CreateTestExecutionResponse> {
        return this.apiClient.createAndStartTestExecution(projectId, spec);
    }

    /**
     * Create and start a TestExecution.
     *
     * @param specBuilder A builder providing the required information for that test type, e.g. {@code Story}
     */
    startExecutionWithBuilder(specBuilder: TestExecutionSpecBuilder): Observable<TestRun> {
        if (!this.session.projectId) {
            throw new Error("A TestExecution must be associated with a project and none is provided or associated with the API session");
        }
        let spec = specBuilder.setApiSession(this.session).build();
        return this.startExecution(spec, this.session.projectId).pipe(map(createTestExecutionResponse => {
            if (!createTestExecutionResponse.optTestRunId) {
                throw new Error("optTestRunId is not defined");
            }
            return new TestRun(createTestExecutionResponse.optTestRunId, this.session);
        }));
    }

    getTestExecutionSummary(testExecutionId: TestExecutionId): Observable<TestExecutionSummary> {
        return this.apiClient.getTestExecution(testExecutionId);
    }

    /**
     * Create new TestSession in current project with given name.
     */
    createTestSession(name: string): Observable<TestSession> {
        if (!this.session.projectId) {
            throw new Error("A TestSession must be associated with a project and none is provided or associated with the API session");
        }
        return this.apiClient.createTestSession(this.session.projectId, name).pipe(map(testSessionId => {
            return new TestSession(testSessionId, this.session);
        }));
    }

    /**
     * Finish a running TestRun.
     */
    finishTestRun(id: TestRunId, status: TestRunEvaluationStatus, msg?: string, detail?: string): Observable<void> {
        return this.apiClient.finishTestRun(id, new TestRunFinishData(status, msg, detail));
    }

}

class TestMgmtApiClient extends WebmateAPIClient {

    private getTestTemplatesTemplate = new UriTemplate( "/projects/${projectId}/tests", "GetTestTemplates");
    private getTestTemplate = new UriTemplate( "/testmgmt/tests/${testId}", "GetTestTemplate");
    private getTestResultsTemplate = new UriTemplate( "/testmgmt/testruns/${testRunId}/results", "GetTestResults");
    private createTestSessionTemplate = new UriTemplate( "/projects/${projectId}/testsessions", "CreateTestSession");
    private createTestExecutionTemplate = new UriTemplate( "/projects/${projectId}/testexecutions", "CreateTestExecution");
    private startTestExecutionTemplate = new UriTemplate( "/testmgmt/testexecutions/${testExecutionId}", "StartTestExecution");
    private getTestExecutionTemplate = new UriTemplate( "/testmgmt/testexecutions/${testExecutionId}", "GetTestExecution");
    private finishTestRunTemplate = new UriTemplate( "/testmgmt/testruns/${testRunId}/finish", "FinishTestRun");
    private getTestRunTemplate = new UriTemplate( "/testmgmt/testruns/${testRunId}", "GetTestRun");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    private handleCreateTestExecutionResponse(response: any): CreateTestExecutionResponse {
        if (!response) {
            throw new Error("Could not create TestExecution. Got no response");
        }
        return CreateTestExecutionResponse.fromJson(response);
    }

    createTestExecution(projectId: ProjectId, spec: TestExecutionSpec): Observable<CreateTestExecutionResponse> {
        let params = Map({
            'projectId': projectId
        });
        return this.sendPOST(this.createTestExecutionTemplate, params, spec.asJson()).pipe(map(resp => {
            return this.handleCreateTestExecutionResponse(resp);
        }));
    }

    createAndStartTestExecution(projectId: ProjectId, spec: TestExecutionSpec): Observable<CreateTestExecutionResponse> {
        let params = Map({
            'projectId': projectId
        });
        // TODO test if this works
        let queryparams = Map({
            'start': 'true'
        });

        return this.sendPOST(this.createTestExecutionTemplate, params, spec.asJson(), queryparams).pipe(map(resp => {
            return this.handleCreateTestExecutionResponse(resp);
        }));
    }

    createTestSession(projectId: ProjectId, name: string): Observable<TestSessionId> {
        let params = Map({
            'projectId': projectId
        });
        let body = Map({
            'name': name
        });

        return this.sendPOST(this.createTestSessionTemplate, params, body).pipe(map(resp => {
            if (!!resp) {
                throw new Error('Could not create TestSession. Got no response');
            }
            return resp;
        }));
    }

    startTestExecution(id: TestExecutionId): Observable<TestRunId> {
        let params = Map({
            'testExecutionId': id
        });
        return this.sendPOST(this.startTestExecutionTemplate, params).pipe(map(resp => {
            if (!!resp) {
                throw new Error('Could not start TestExecution. Got no response');
            }
            return resp;
        }));
    }

    getTestExecution(id: TestExecutionId): Observable<TestExecutionSummary> {
        let params = Map({
            'testExecutionId': id
        });
        return this.sendGET(this.getTestExecutionTemplate, params).pipe(map(resp => {
            if (!!resp) {
                throw new Error('Could not get TestExecution. Got no response');
            }
            return TestExecutionSummary.fromJson(resp);
        }));
    }

    getTestRun(id: TestRunId): Observable<TestRunInfo> {
        let params = Map({
            'testRunId': id
        });
        return this.sendGET(this.getTestRunTemplate, params).pipe(map(resp => {
            if (!!resp) {
                throw new Error('Could not get TestRun. Got no response');
            }
            return TestRunInfo.fromJson(resp);
        }));
    }

    finishTestRun(id: TestRunId, data: TestRunFinishData): Observable<void> {
        let params = Map({
            'testRunId': id
        });
        return this.sendPOST(this.finishTestRunTemplate, params, data.asJson()).pipe(map(resp => {
            if (!!resp) {
                throw new Error('Could not get TestRun. Got no response');
            }
        }));
    }

    getTestTemplates(projectId: ProjectId): Observable<TestTemplate[]> {
        let params = Map({
            'projectId': projectId
        });
        return this.sendGET(this.getTestTemplatesTemplate, params).pipe(map(resp => {
            return resp.map((testTemplate: any) => TestTemplate.fromJson(testTemplate));
        }));
    }

    getTest(testId: TestId): Observable<Test> {
        let params = Map({
            "testId": testId
        });
        return this.sendGET(this.getTestTemplate, params);
    }

    /**
     * Get TestResults of Test with given id and testrun index.
     *
     * @param id Id of TestRun.
     */
    getTestResults(id: TestRunId): Observable<TestResult[]> {
        let params = Map({
           "testRunId": id
        });
        return this.sendGET(this.getTestResultsTemplate, params).pipe(map(r => r.value));
    }

}
