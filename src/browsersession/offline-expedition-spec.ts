import {ExpeditionSpec} from "./expedition-spec";
import {BrowserSessionId} from "../types";

/**
 * Specification that bases on an already finished expedition and its artifacts.
 */
export class OfflineExpeditionSpec implements ExpeditionSpec {
    constructor(public readonly expeditionId: BrowserSessionId) {}

    asJson(): any {
        return {
            'type': 'OfflineExpeditionSpec',
            'expeditionId': this.expeditionId
        };
    }
}
