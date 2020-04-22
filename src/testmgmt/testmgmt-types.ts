import {BrowserSessionArtifactId, DateTime, ProjectId, TestResultId, TestResultType, TestRunId, UserId} from "../types";
import {List} from "immutable";
import {Tag} from "../tag";

export type TestId = string;

export interface TestInfo {
    id: TestId,
    name: string,
    creationTime: DateTime,
    description: string,
    version: number
}

export interface TestRunInfo {
    testId: TestId,
    index: number
}

/**
 * Contains information about one execution of a Test.
 */
export interface TestRunSummary {
    testId: TestId,
    testRunInfo: TestRunInfo,
    creator: UserId,
    projectId: ProjectId,
    startTime: DateTime,
    endTime: DateTime | undefined,
    lastUpdateTime: DateTime | undefined,
    numIssues: number | undefined,
    numFilteredIssues: number | undefined
}


export interface Test {
    info: TestInfo,
    testRuns: List<TestRunSummary>
}

export interface TestResult {
    id: TestResultId,
    testId: TestId,
    testRunId: TestRunId,
    issueType: TestResultType,
    properties: any,
    associatedArtifacts: List<BrowserSessionArtifactId>,
    tags: List<Tag>
}
