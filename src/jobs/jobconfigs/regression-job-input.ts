import {BrowserSessionId} from "../../types";
import {JobInput} from "../job-input";

export class RegressionJobInput implements JobInput {
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
        }

    }
}

