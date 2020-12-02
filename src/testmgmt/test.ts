import {List} from "immutable";
import {TestRunSummary} from "./test-run-summary";
import {TestInfo} from "./test-info";

/**
 * Represents a Test in webmate.
 */
export interface Test {
    info: TestInfo,
    testRuns: List<TestRunSummary>
}
