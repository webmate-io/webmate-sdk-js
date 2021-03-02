/**
 * For serialization of Finish data.
 */
import {TestRunEvaluationStatus} from "./test-run-evaluation-status";

export class TestRunFinishData {
   constructor(public readonly status: TestRunEvaluationStatus,
               public readonly message?: string,
               public readonly detail?: string) {}

   asJson(): any {
      let result: any = {
         'status': this.status
      };
      if (!!this.message) {
         result['message'] = this.message;
      }
      if (!!this.detail) {
         result['detail'] = this.detail;
      }
      return result;
   }
}
