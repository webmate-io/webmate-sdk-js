import {Artifact} from "../artifacts/artifact-types";

export type TestMailAddress = string;

export class TestMail {

    constructor(public from: string, public to: string[], public emailContent: any){}

    public static fromArtifact(artifact: Artifact): TestMail {
        return new TestMail(artifact.data.from, artifact.data.to, artifact.data.emailContent);
    }
}
