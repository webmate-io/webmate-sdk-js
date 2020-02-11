import {BrowserSessionId} from "../../types";
import {WellKnownJobInput} from "../well-known-job-input";

export class CrossbrowserJobInput implements WellKnownJobInput {
    name: string = "browsersession_crossbrowser_analysis";
    values: Object;

    constructor(referenceSession: BrowserSessionId, compareSessions: BrowserSessionId[], filterDynamicElements: boolean = true) {
        let compareSessionsObject: Object[] = [];
        for (let id of compareSessions) {
            compareSessionsObject.push({
                type: "BrowserSessionRef",
                data: id
            });
        }

        this.values = {
            enabledynamicelementsfilter: {
                type: "Boolean",
                data: filterDynamicElements
            },
            referenceSession: {
                type: "BrowserSessionRef",
                data: referenceSession
            },
            matchingType: {
                type: "String",
                data: "tag"
            },
            compareSessions: {
                type: "List[BrowserSessionRef]",
                data: compareSessionsObject
            }
        };
    }
}

