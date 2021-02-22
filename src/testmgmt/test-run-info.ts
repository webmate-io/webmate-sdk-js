import {TestId} from "../types";

/**
 * Identifies TestRun in a Test.
 */
export interface TestRunInfo {
    testId: TestId,
    index: number
}
