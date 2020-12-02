import {TestId} from "./testmgmt-types";

/**
 * Identifies TestRun in a Test.
 */
export interface TestRunInfo {
    testId: TestId,
    index: number
}
