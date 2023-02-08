import {WebmateAPISession} from "../webmate-api-session";
import {TestRunId} from "../types";
import {concat, Observable, of, throwError} from "rxjs";
import {TestRunInfo} from "./test-run-info";
import {TestRunEvaluationStatus} from "./test-run-evaluation-status";
import {delay, map, mergeMap, retryWhen, take} from "rxjs/operators";
import {TestRunExecutionStatus} from "./test-run-execution-status";

/**
 * Facade for a (running or finished) TestRun
 */
export class TestRun {

    private readonly MAX_WAITING_TIME_MILLIS: number = 300_000; // 300 seconds
    private readonly WAITING_POLLINTERVAL_MILLIS: number = 3_000; // 3 seconds
    private readonly MAX_RETRIES: number = this.MAX_WAITING_TIME_MILLIS / this.WAITING_POLLINTERVAL_MILLIS;

    constructor(public readonly id: TestRunId, private readonly session: WebmateAPISession) {}

    /**
     * Retrieve current information about this test run from webmate.
     */
    retrieveCurrentInfo(): Observable<TestRunInfo> {
        return this.session.testMgmt.getTestRun(this.id);
    }

    /**
     * Set the name for a given test run.
     *
     * @param name New TestRun name.
     */
    setName(name: string): Observable<void> {
        return this.session.testMgmt.setTestRunName(this.id, name);
    }

    /**
     * Finish TestRun.
     *
     * @param msg Short message explaining the result of the test run.
     * @param detail Detailed information, e.g. stack trace.
     */
    finish(status: TestRunEvaluationStatus, msg?: string, detail?: string): Observable<void> {
        return this.session.testMgmt.finishTestRun(this.id, status, msg, detail);
    }

    /**
     * Block, until the TestRun goes into a finished state (completed or failed).
     *
     * @return returns the TestRun info of the finished TestRun.
     */
    waitForCompletion(): Observable<TestRunInfo> {
        return of("").pipe(
            mergeMap(() => this.retrieveCurrentInfo()),
            map(info => {
                if (info.executionStatus == TestRunExecutionStatus.RUNNING || info.executionStatus == TestRunExecutionStatus.CREATED
                    || info.evaluationStatus == TestRunEvaluationStatus.PENDING_PASSED || info.evaluationStatus == TestRunEvaluationStatus.PENDING_FAILED) {
                    throw new Error(`Could not get test run info within timeout.`);
                } else {
                    return info;
                }
            }),
            retryWhen(errors => concat(errors.pipe(delay(this.WAITING_POLLINTERVAL_MILLIS), take(this.MAX_RETRIES)), throwError(errors)))
        );
    }
}
