import {BrowserType} from "../browser-type";

export class SeleniumCapability {

    public readonly browserLanguage?: string;

    constructor(public readonly browserName: BrowserType,
                public readonly version: string,
                public readonly platform: string,
                public readonly supportsProxy: boolean,
                browserLanguage?: string) {
        if (browserLanguage == '') {
            this.browserLanguage = undefined;
        }
    }
}
