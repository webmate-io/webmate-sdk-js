import {ActionSpanId} from "../types";
import {JsonSerializable} from "../json-serializable";

export class FinishStoryActionAddArtifactData implements JsonSerializable {

    private constructor(public readonly spanId: ActionSpanId,
                        public readonly result?: any,
                        public readonly errorMsg?: string,
                        public readonly errorDetails?: any) {}

    public static successful(spanId: ActionSpanId, message?: string): FinishStoryActionAddArtifactData {
        let result: any = {
            "success": true
        };
        if (!!message) {
            result["message"] = message;
        }

        return new FinishStoryActionAddArtifactData(spanId, result);
    }

    public static failure(spanId: ActionSpanId, errorMsg: string, detail?: any) {
        return new FinishStoryActionAddArtifactData(spanId, undefined, errorMsg, detail);
    }

    public asJson() {
        let data: any = {
            "spanId": this.spanId
        };
        if (this.result) {
            data["result"] = this.result;
        } else {
            let errorData: any = {
                "errorMessage": this.errorMsg
            };
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
