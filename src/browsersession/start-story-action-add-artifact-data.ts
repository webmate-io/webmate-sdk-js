import {List} from "immutable";
import {ActionSpanId, TestRunId} from "../types";
import {JsonSerializable} from "../json-serializable";

export class StartStoryActionAddArtifactData implements JsonSerializable {
    constructor(private name: string, private spanId: ActionSpanId, private associatedTestRuns?: List<TestRunId>) {
    }

    asJson() {
        let data = {
            "name": this.name,
            "actionType": "story",
            "spanId": this.spanId
        };

        let object: any = {
            "data": data,
            "artifactType": "Action.ActionStart"
        };

        if (!!this.associatedTestRuns && !this.associatedTestRuns.isEmpty()) {
            object["associatedTestRuns"] = this.associatedTestRuns;
        }

        return object;
    }

}
