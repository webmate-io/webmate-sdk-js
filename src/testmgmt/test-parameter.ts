import {WMDataType} from "../jobs/wm-data-type";
import {WMValue} from "../jobs/wm-value";

export class TestParameter {
    constructor(public readonly name: string,
                public readonly parameterType: WMDataType,
                public readonly required: boolean,
                public readonly optDescription?: string,
                public readonly optDisplayName?: string,
                public readonly defaultVal?: WMValue) {
    }
}
