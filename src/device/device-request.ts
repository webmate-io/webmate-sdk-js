import {DeviceRequirements} from "./device-properties";

export class DeviceRequest {
    constructor(public name: string, public deviceRequirements: DeviceRequirements) {}
}
