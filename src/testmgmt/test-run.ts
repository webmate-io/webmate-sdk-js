import {WebmateAPISession} from "../webmate-api-session";
import {TestRunId} from "../types";
import {Observable} from "rxjs";
import {TestRunInfo} from "./test-run-info";
import {TestRunEvaluationStatus} from "./test-run-evaluation-status";

/**
 * Facade for a (running or finished) TestRun
 */
export class TestRun {

    private readonly MAX_WAITING_TIME_MILLIS: number = 300_000; // 300 seconds
    private readonly WAITING_POLLINTERVAL_MILLIS: number = 2_000; // 2 seconds

    constructor(public readonly id: TestRunId, private readonly session: WebmateAPISession) {}

    /**
     * Retrieve current information about this test run from webmate.
     */
    retrieveCurrentInfo(): Observable<TestRunInfo> {
        return this.session.testMgmt.getTestRun(this.id);
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

    // TODO waitForCompletion
}
