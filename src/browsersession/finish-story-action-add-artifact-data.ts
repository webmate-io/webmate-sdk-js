import {ActionSpanId} from "../types";

export class FinishStoryActionAddArtifactData {

    private constructor(private spanId: ActionSpanId, private result?, private errorMsg?: String, private errorDetails?) {
    }

    public static successful(spanId: ActionSpanId): FinishStoryActionAddArtifactData {
        let result = {
            "success": true
        };
        return new FinishStoryActionAddArtifactData(spanId, result);
    }

    public static successful(spanId: ActionSpanId, message: String) {
        let result = {
            "success": true,
            "message": message
        };
        return new FinishStoryActionAddArtifactData(spanId, result);
    }

    public static failure(spanId: ActionSpanId, errorMsg: String, detail?) {
        let result = {
            "success": true // TODO is this correct?
        };
        return new FinishStoryActionAddArtifactData(spanId, result);
    }

    public toJson() {
        let data = {
            "spanId": this.spanId
        };
        if (this.result) {
            data["result"] = this.result;
        } else {
            let errorData = {
                "errorMessage": this.errorMsg
            }
            if (this.errorDetails) {
                errorData["errorDetails"] = this.errorDetails;
            }
            data["error"] = errorData;
        }

        let object = {
            "artifactType": "Action.ActionFinish",
            "data": data
        };

        return object;
    }

}
