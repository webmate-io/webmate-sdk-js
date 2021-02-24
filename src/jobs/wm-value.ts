import {WMDataType} from "./wm-data-type";
import {JsonSerializable} from "../json-serializable";

/**
 * Input or output value of JobEngine
 */
export class WMValue implements JsonSerializable {

    constructor(public readonly dataType: WMDataType, public readonly value: JsonSerializable) {}

    asJson(): any {
        return {
            'type': this.dataType.tpe,
            'data': this.value.asJson()
        };
    }

}
