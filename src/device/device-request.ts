import {DeviceRequirements} from "./device-properties";
import {JsonSerializable} from "../json-serializable";

export class DeviceRequest implements JsonSerializable {
    constructor(public readonly name: string, public readonly deviceRequirements: DeviceRequirements) {}

    asJson(): any {
        let requirements: any = {};
        this.deviceRequirements.forEach((value, key) => {
            requirements[key || ""] = value;
        });
        return {
            "name:": this.name,
            "deviceRequirements": requirements
        };
    }

}
