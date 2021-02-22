import {DateTime, TestExecutionId, TestTemplateId, UserId} from "../types";
import {TestExecutionExecutionStatus} from "./test-execution-execution-status";
import {TestExecutionEvaluationStatus} from "./test-execution-evaluation-status";

export class TestExecutionSummary {
    constructor(public testExecutionId: TestExecutionId,
                public readonly testId: TestTemplateId,
                public readonly version: number,
                public readonly creator: UserId,
                public readonly executionStatus: TestExecutionExecutionStatus,
                public readonly evaluationStatus: TestExecutionEvaluationStatus,
                public readonly creationTime: DateTime) {
    }

    public static fromJson(json: any): TestExecutionSummary {
        return new TestExecutionSummary(json.testExecutionId,
            json.testId,
            json.version,
            json.creator,
            json.executionStatus,
            json.evaluationStatus,
            json.creationTime);
    }
}
