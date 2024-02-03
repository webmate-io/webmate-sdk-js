import {BrowserSessionId, DateTime, DeviceId} from "../types";

export class BrowserSessionInfo {

    constructor(
        public readonly id: BrowserSessionId,
        public readonly start?: DateTime,
        public readonly end?: DateTime,
        public readonly deviceId?: DeviceId
    ) {}

}