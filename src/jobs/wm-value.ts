import {WMDataType} from "./wm-data-type";

/**
 * Input or output value of JobEngine
 */
export class WMValue {

    public type: WMDataType;
    public data: any;

    constructor(dataType: WMDataType, value: any) {
        this.type = dataType;
        this.data = value;
    }

}
