import {ArtifactId, BrowserSessionId, DateTime, ProjectId, TestRunId} from "../types";

export class ArtifactType {

    constructor(public category: ArtifactCategory, public name: string) {}

    public static fromString(t: string): ArtifactType {
        let parts = t.split(".");
        return new ArtifactType(new ArtifactCategory(parts[0]), parts[1]);
    }

    public asSerializedString(): string {
        return this.category.name + "." + this.name;
    }
}

export class ArtifactCategory {
    constructor(public name: string){}
}

export interface ArtifactInfo {
    id: ArtifactId,
    artifactType: ArtifactType,
    projectId: ProjectId,
    creationTime: DateTime,
    endTime?: DateTime,
    associatedBrowserSession?: BrowserSessionId,
    associatedTestRun?: TestRunId,
    associations: ArtifactAssociation
}

export interface ArtifactAssociation {
    browserSession: BrowserSessionId,
    testRun: TestRunId
}

export interface Artifact extends ArtifactInfo {
    data: any
}
