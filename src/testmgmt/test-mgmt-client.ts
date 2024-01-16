import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {ProjectId, TestRunId, TestId, TestSessionId, TestExecutionId} from "../types";
import {List, Map} from "immutable";
import {concat, Observable, of, throwError} from "rxjs";
import {delay, map, mergeMap, retryWhen, take} from "rxjs/operators";
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
import fs from "fs";
import {TestRunExecutionStatus} from "./test-run-execution-status";

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
     * Set the name for a given test run.
     *
     * @param testRunId Id of TestRun.
     * @param name New TestRun name.
     */
    setTestRunName(testRunId: TestRunId, name: string): Observable<void> {
        return this.apiClient.setTestRunName(testRunId, name);
    }

    // /**
    //  * Get Id of TestRun associated with a Selenium session.
    //  *
    //  * @param opaqueSeleniumSessionIdString selenium session id
    //  * @return test run id
    //  */
    // getTestRunIdForSessionId(opaqueSeleniumSessionIdString: string): Observable<TestRunId> {
    //     return of(opaqueSeleniumSessionIdString);
    // }

    /**
     * Create and start a test execution.
     * This method is blocking:
     * it internally calls a method similar to {@link waitForTestRunCompletion}
     * to wait until the associated test run is running.
     * If the test run is not running after the timeout, the returned observable will go into an error state.
     *
     * @param spec      The specification metadata for the test execution.
     * @param projectId The id of the project the test execution belongs to.
     * @return          The response data, including the test execution id and the id of the associated test run.
     */
    startExecution(spec: TestExecutionSpec, projectId: ProjectId): Observable<CreateTestExecutionResponse> {
        return this.apiClient.createAndStartTestExecution(projectId, spec).pipe(
            mergeMap(response => {
                if (!response.optTestRunId) {
                    throw new Error("optTestRunId is not defined");
                }
                return this.apiClient.waitForTestRunRunning(response.optTestRunId).pipe(map(() => response));
            })
        );
    }

    /**
     * Create and start a test execution.
     * This method is blocking:
     * it internally calls a method similar to {@link waitForTestRunCompletion}
     * to wait until the associated test run is running.
     * If the test run is not running after the timeout, the returned observable will go into an error state.
     *
     * @param specBuilder A builder providing the required information for that test type, e.g. {@code Story}.
     * @return            The test run associated with the test execution.
     */
    startExecutionWithBuilder(specBuilder: TestExecutionSpecBuilder): Observable<TestRun> {
        if (!this.session.projectId) {
            throw new Error("A TestExecution must be associated with a project and none is provided or associated with the API session");
        }
        const spec = specBuilder.setApiSession(this.session).build();
        return this.startExecution(spec, this.session.projectId).pipe(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            map(response => new TestRun(response.optTestRunId!, this.session))
        );
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
     * Finish a running test run.
     * This method is blocking:
     * it internally calls the {@link waitForTestRunCompletion} method
     * to wait until the test run is finished.
     * If the test run does not finish before the timeout, the returned observable will go into an error state.
     *
     * @param id     The id of the test run to finish.
     * @param status The status to finish the test run with.
     * @param msg    A short message explaining the result of the test run.
     * @param detail Detailed information, e.g. a stack trace.
     */
    finishTestRun(id: TestRunId, status: TestRunEvaluationStatus, msg?: string, detail?: string): Observable<void> {
        return this.apiClient.finishTestRun(id, new TestRunFinishData(status, msg, detail));
    }

    /**
     * Generate an export for the given project using the specified exporter and config
     */
    testlabExport(projectId: ProjectId, exporter: string, config: Map<string, Object>, targetFilePath: string): Observable<void> {
        return this.apiClient.testlabExport(projectId, exporter, config, targetFilePath);
    }

    /**
     * Block until the test run goes into a finished state (completed or failed) or timeout occurs.
     * The default timeout is 10 minutes.
     * If the test run does not finish before the timeout, the returned observable will go into an error state.
     *
     * @param id                   The id of the test run to wait for.
     * @param maxWaitingTimeMillis How long to wait before timeout.
     * @return                     The test run info of the finished test run.
     */
    waitForTestRunCompletion(id: TestRunId, maxWaitingTimeMillis?: number): Observable<TestRunInfo> {
        return this.apiClient.waitForTestRunCompletion(id, maxWaitingTimeMillis);
    }

}

class TestMgmtApiClient extends WebmateAPIClient {

    private readonly MAX_LONG_WAITING_TIME_MILLIS: number = 600_000; // 10 minutes
    private readonly WAITING_POLLING_INTERVAL_MILLIS: number = 3_000; // 3 seconds

    private getTestTemplatesTemplate = new UriTemplate( "/projects/${projectId}/tests", "GetTestTemplates");
    private getTestTemplate = new UriTemplate( "/testmgmt/tests/${testId}", "GetTestTemplate");
    private getTestResultsTemplate = new UriTemplate( "/testmgmt/testruns/${testRunId}/results", "GetTestResults");
    private createTestSessionTemplate = new UriTemplate( "/projects/${projectId}/testsessions", "CreateTestSession");
    private createTestExecutionTemplate = new UriTemplate( "/projects/${projectId}/testexecutions", "CreateTestExecution");
    private startTestExecutionTemplate = new UriTemplate( "/testmgmt/testexecutions/${testExecutionId}", "StartTestExecution");
    private getTestExecutionTemplate = new UriTemplate( "/testmgmt/testexecutions/${testExecutionId}", "GetTestExecution");
    private finishTestRunTemplate = new UriTemplate( "/testmgmt/testruns/${testRunId}/finish", "FinishTestRun");
    private getTestRunTemplate = new UriTemplate( "/testmgmt/testruns/${testRunId}", "GetTestRun");
    private setTestRunNameTemplate = new UriTemplate("/testmgmt/testruns/${testRunId}/name", "SetTestRunName");

    private exportTemplate = new UriTemplate("/projects/${projectId}/testlab/export/${exporter}", "TestMgmtExport");

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
            if (!resp) {
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
            if (!resp) {
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
            if (!resp) {
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
            if (!resp) {
                throw new Error('Could not get TestRun. Got no response');
            }
            return TestRunInfo.fromJson(resp);
        }));
    }

    setTestRunName(id: TestRunId, name: string): Observable<void> {
        let params = Map({
            'testRunId': id
        });
        let body = {
            'name': name
        };
        return this.sendPOST(this.setTestRunNameTemplate, params, body).pipe(map(resp => {
            if (!resp) {
                throw new Error('Could not set test run name. Got no response');
            }
        }));
    }

    finishTestRun(id: TestRunId, data: TestRunFinishData): Observable<void> {
        let params = Map({
            'testRunId': id
        });
        return this.sendPOST(this.finishTestRunTemplate, params, data.asJson()).pipe(
            map(resp => {
                if (!resp) {
                    throw new Error('Could not finish TestRun. Got no response');
                }
            }),
            mergeMap(() => this.waitForTestRunCompletion(id)),
            map(() => { return; })
        );
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

    testlabExport(projectId: ProjectId, exporter: string, config: Map<string, object>, targetFilePath: string): Observable<void> {
        let params = Map({
            "projectId": projectId,
            "exporter": exporter
        });
        return this.sendPOSTStreamResponse(this.exportTemplate, params, config).pipe(map(resp => {
            if (!resp) {
                throw new Error('Could not export. Got no response');
            }
            resp.pipe(fs.createWriteStream(targetFilePath));
        }));
    }

    waitForTestRunCompletion(testRunId: TestRunId, maxWaitingTimeMillis?: number): Observable<TestRunInfo> {
        if (!maxWaitingTimeMillis) maxWaitingTimeMillis = this.MAX_LONG_WAITING_TIME_MILLIS;
        const maxRetries: number = maxWaitingTimeMillis / this.WAITING_POLLING_INTERVAL_MILLIS;
        return of("").pipe(
            mergeMap(() => this.getTestRun(testRunId)),
            map(info => {
                if (info.executionStatus == TestRunExecutionStatus.RUNNING || info.executionStatus == TestRunExecutionStatus.CREATED
                    || info.evaluationStatus == TestRunEvaluationStatus.PENDING_PASSED || info.evaluationStatus == TestRunEvaluationStatus.PENDING_FAILED) {
                    throw new Error(`Could not get test run info within timeout.`);
                } else {
                    return info;
                }
            }),
            retryWhen(errors => concat(errors.pipe(delay(this.WAITING_POLLING_INTERVAL_MILLIS), take(maxRetries)), throwError(errors)))
        );
    }

    waitForTestRunRunning(testRunId: TestRunId, maxWaitingTimeMillis?: number): Observable<TestRunInfo> {
        if (!maxWaitingTimeMillis) maxWaitingTimeMillis = this.MAX_LONG_WAITING_TIME_MILLIS;
        const maxRetries: number = maxWaitingTimeMillis / this.WAITING_POLLING_INTERVAL_MILLIS;
        return of("").pipe(
            mergeMap(() => this.getTestRun(testRunId)),
            map(info => {
                if (info.executionStatus == TestRunExecutionStatus.CREATED) {
                    throw new Error(`Could not get test run info within timeout.`);
                } else {
                    return info;
                }
            }),
            retryWhen(errors => concat(errors.pipe(delay(this.WAITING_POLLING_INTERVAL_MILLIS), take(maxRetries)), throwError(errors)))
        );
    }

}
