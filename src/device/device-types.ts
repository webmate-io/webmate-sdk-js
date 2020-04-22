import {DeviceTemplateId} from "../types";

export interface DeviceTemplate {
    id: DeviceTemplateId,
    providerType: string,
    platform: string,
    name: string,
    capabilities: any,
    size: any
}
