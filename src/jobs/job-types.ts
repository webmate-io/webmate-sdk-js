import {DateTime, JobRunId, TestRunId, UserId} from "../types";
import {TestId, TestRunInfo} from "../testmgmt/testmgmt-types";

export interface JobRunSummary {
    id: JobRunId,
    state: string,
    creator: UserId,
    creationTime: DateTime,
    endTime: DateTime | undefined,
    lastUpdateTime: DateTime | undefined,
    failureMessage: string | undefined,
    inputPorts: any,
    testId: TestId,
    optTestRunInfo: TestRunInfo | undefined,
    summaryInformation: any
}
