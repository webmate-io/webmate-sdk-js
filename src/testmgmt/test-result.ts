import {BrowserSessionArtifactId, TestResultId, TestResultType, TestRunId} from "../types";
import {List} from "immutable";
import {Tag} from "../tag";
import {TestId} from "../types";

/**
 * Result of a Test, e.g. a defect that has been found.
 */
export interface TestResult {
    id: TestResultId,
    testId: TestId,
    testRunId: TestRunId,
    issueType: TestResultType,
    properties: any,
    associatedArtifacts: List<BrowserSessionArtifactId>,
    tags: List<Tag>
}
