import {BrowserSessionId, DateTime, DeviceId} from "../types";

export interface BrowserSessionInfo {
    id: BrowserSessionId,
    optStart?: DateTime,
    optEnd?: DateTime,
    optDeviceId?: DeviceId
}
