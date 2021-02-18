import {ActionSpanId} from "../types";

export class FinishStoryActionAddArtifactData {

    private constructor(private spanId: ActionSpanId, private result?: any, private errorMsg?: string, private errorDetails?: any) {
    }

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
        let result = {
            "success": true // TODO is this correct?
        };
        return new FinishStoryActionAddArtifactData(spanId, result);
    }

    public toJson() {
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
