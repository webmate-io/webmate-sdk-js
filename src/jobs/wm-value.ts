import {WMDataType} from "./wm-data-type";

/**
 * Input or output value of JobEngine
 */
export class WNValue {

    public type: WMDataType;
    public data;

    constructor(dataType: WMDataType, value) {
        this.type = dataType;
        this.data = value;
    }

}
