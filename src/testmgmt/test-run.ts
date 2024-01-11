import {WebmateAPISession} from "../webmate-api-session";
import {TestRunId} from "../types";
import {concat, Observable, of, throwError} from "rxjs";
import {TestRunInfo} from "./test-run-info";
import {TestRunEvaluationStatus} from "./test-run-evaluation-status";

/**
 * Facade for a (running or finished) TestRun
 */
export class TestRun {

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
     * Finish the test run.
     * This method is blocking:
     * it internally calls the {@link waitForCompletion} method
     * to wait until the test run is finished.
     * If the test run does not finish before the timeout, the returned observable will go into an error state.
     *
     * @param status The status to finish the test run with.
     * @param msg    A short message explaining the result of the test run.
     * @param detail Detailed information, e.g. a stack trace.
     */
    finish(status: TestRunEvaluationStatus, msg?: string, detail?: string): Observable<void> {
        return this.session.testMgmt.finishTestRun(this.id, status, msg, detail);
    }

    /**
     * Block until the test run goes into a finished state (completed or failed) or timeout occurs.
     * The default timeout is 10 minutes.
     * If the test run does not finish before the timeout, the returned observable will go into an error state.
     *
     * @return The test run info of the finished test run.
     */
    waitForCompletion(): Observable<TestRunInfo> {
        return this.session.testMgmt.waitForTestRunCompletion(this.id);
    }
}
