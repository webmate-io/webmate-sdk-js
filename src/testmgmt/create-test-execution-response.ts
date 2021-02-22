/**
 * Contains TestExecutionId and optionally TestRunId.
 */
import {TestExecutionId, TestRunId} from "../types";

export class CreateTestExecutionResponse {

    constructor(public readonly executionId: TestExecutionId, public readonly optTestRunId?: TestRunId) {}

    public static fromJson(json: any): CreateTestExecutionResponse {
        return new CreateTestExecutionResponse(json.testExecutionId, json.testRunId);
    }

}
