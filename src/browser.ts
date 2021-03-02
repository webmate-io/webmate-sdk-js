import {Platform} from "./platform";

export class Browser {

    public readonly platform: Platform;

    constructor(public readonly browserType: string,
                public readonly version: string,
                platform?: Platform,
                platformStr?: string,
                public properties?: any) {
        // Set platform
        if (!!platform) {
            this.platform = platform;
        } else {
            if (!!platformStr) {
                this.platform = Platform.fromString(platformStr);
            } else {
                throw new Error(`No valid platform or platformStr was passed.`);
            }
        }

    }
}
