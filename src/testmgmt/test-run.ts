import { WebmateAPISession } from "../webmate-api-session";
import { TestRunId } from "../types";

/**
 * Facade for a (running or finished) TestRun
 */
export class TestRun {

    private readonly MAX_WAITING_TIME_MILLIS: number = 300_000; // 300 seconds
    private readonly WAITING_POLLINTERVAL_MILLIS: number = 2_000; // 2 seconds

    constructor(public readonly id: TestRunId, private readonly session: WebmateAPISession) {}

}
