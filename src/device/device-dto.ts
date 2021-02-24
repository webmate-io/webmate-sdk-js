import {DateTime, DeviceId, DeviceSlotId, ProjectId} from "../types";
import {DeviceRequest} from "./device-request";

export interface DeviceDTO {
    id: DeviceId,
    state: string,
    creationTime: DateTime,
    name: string,
    request: DeviceRequest,
    metaData: any,
    properties: any,
    ticketCapacity: any,
    projectId: ProjectId,
    slot: DeviceSlotId
}
