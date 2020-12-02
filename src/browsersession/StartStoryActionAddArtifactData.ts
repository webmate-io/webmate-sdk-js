import {List} from "immutable";
import {ActionSpanId, TestRunId} from "../types";

export class StartStoryActionAddArtifactData {
    constructor(private name: string, private spanId: ActionSpanId, private associatedTestRuns?: List<TestRunId>) {
    }

    public toJson() {
        let data = {
            "name": this.name,
            "actionType": "story",
            "spanId": this.spanId
        }

        let object = {
            "data": data,
            "artifactType": "Action.ActionStart"
        };

        if (!this.associatedTestRuns?.isEmpty()) {
            object["associatedTestRuns"] = this.associatedTestRuns;
        }

        return object;
    }

}
