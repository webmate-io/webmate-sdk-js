import {
    ApplicationModelId,
    BrowserSessionId,
    DateTime, DeviceId, DeviceSlotId,
    ProjectId,
    TestExecutionId,
    TestRunId,
    UserId
} from "../types";
import {TestRunEvaluationStatus} from "./test-run-evaluation-status";
import {TestType} from "./testtypes/test-type";
import {TestRunExecutionStatus} from "./test-run-execution-status";
import {DeviceRequest} from "../device/device-request";

export interface TestRunDeviceInfo {
    id: DeviceId,
    creationTime: DateTime,
    name: string,
    request: DeviceRequest,
    metaData: any,
    properties: any,
}

/**
 * Identifies TestRun in a Test.
 */
export class TestRunInfo {

    constructor(public readonly testRunId: TestRunId,
                public readonly name: string,
                public readonly testExecutionId: TestExecutionId,
                public readonly creator: UserId,
                public readonly projectId: ProjectId,
                public readonly startTime: DateTime,
                public readonly lastUpdateTime: DateTime,
                public readonly evaluationStatus: TestRunEvaluationStatus,
                public readonly executionStatus: TestRunExecutionStatus,
                public readonly testType: TestType,
                public readonly issueSummary: any,
                public readonly expeditions: Array<BrowserSessionId>,
                public readonly failure: any,
                public readonly models: Array<ApplicationModelId>,
                public readonly devices: Array<TestRunDeviceInfo>,
                public readonly output?: any,
                public readonly endTime?: DateTime) {
    }

    public static fromJson(json: any): TestRunInfo {
        return new TestRunInfo(json.testRunId,
            json.name,
            json.testExecutionId,
            json.creator,
            json.projectId,
            json.startTime,
            json.lastUpdateTime,
            json.evaluationStatus,
            json.executionStatus,
            json.testType,
            json.issueSummary,
            json.expeditions,
            json.failure,
            json.models,
            json.devices,
            json.output,
            json.endTime);
    }

    toString(): string {
        return "TestRunInfo{" +
            "testRunId=" + this.testRunId +
            ", name='" + this.name + '\'' +
            ", testExecutionId=" + this.testExecutionId +
            ", creator=" + this.creator +
            ", output=" + this.output +
            ", startTime=" + this.startTime +
            ", endTime=" + this.endTime +
            ", lastUpdateTime=" + this.lastUpdateTime +
            ", evaluationStatus=" + this.evaluationStatus +
            ", executionStatus=" + this.executionStatus +
            ", testType=" + this.testType +
            ", issueSummary=" + this.issueSummary +
            ", expeditions=" + this.expeditions +
            ", failure=" + this.failure +
            ", models=" + this.models +
            ", devices=" + this.devices +
            ", projectId=" + this.projectId +
            '}';
    }
}
