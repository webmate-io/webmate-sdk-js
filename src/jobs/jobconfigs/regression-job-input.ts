import {BrowserSessionId} from "../../types";
import {WellKnownJobInput} from "../well-known-job-input";

export class RegressionJobInput implements WellKnownJobInput {
    name: string = "browsersession_regression_analysis";
    values: Object;

    constructor(referenceSession: BrowserSessionId, compareSession: BrowserSessionId, filterDynamicElements: boolean = true) {
        this.values = {
            enabledynamicelementsfilter: {
                type: "Boolean",
                data: filterDynamicElements
            },
            referenceSession: {
                type: "BrowserSessionRef",
                data: referenceSession
            },
            compareSession: {
                type: "BrowserSessionRef",
                data: compareSession
            },
            matchingType: {
                type: "String",
                data: "tag"
            }
        };
    }
}

