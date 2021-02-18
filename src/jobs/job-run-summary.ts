import {DateTime, JobRunId, TestRunId, UserId} from "../types";
import {TestId} from "../testmgmt/testmgmt-types";

export interface JobRunSummary {
    id: JobRunId,
    state: string,
    creator: UserId,
    creationTime: DateTime,
    startTime: DateTime | undefined,
    endTime: DateTime | undefined,
    lastUpdateTime: DateTime | undefined,
    failureMessage: string | undefined,
    inputPorts: any,
    testId: TestId,
    testRunId: TestRunId,
    summaryInformation: any
}
