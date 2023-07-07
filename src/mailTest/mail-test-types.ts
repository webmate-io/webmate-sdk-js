import {Artifact} from "../artifacts/artifact-types";
import {ProjectId, TestRunId, UserId} from "../types";

export type TestMailAddress = string;

export class TestMailAccount {
    constructor(public emailAddress: TestMailAddress, public projectId: ProjectId, public creator: UserId, public optTestRunId?: TestRunId){}
}

export class TestMail {

    constructor(public from: string, public to: string[], public emailContent: any){}

    public static fromArtifact(artifact: Artifact): TestMail {
        return new TestMail(artifact.data.from, artifact.data.to, artifact.data.emailContent);
    }
}
