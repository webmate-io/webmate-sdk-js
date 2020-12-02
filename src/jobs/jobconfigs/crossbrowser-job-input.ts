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
            referenceSession: {
                type: "BrowserSessionRef",
                data: referenceSession
            },
            compareSessions: {
                type: "List[BrowserSessionRef]",
                data: compareSessionsObject
            },
            matchingType: {
                type: "String",
                data: "tag"
            },
            enabledynamicelementsfilter: {
                type: "Boolean",
                data: filterDynamicElements
            }
        };
    }
}

