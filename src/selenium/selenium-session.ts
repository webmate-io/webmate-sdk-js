import { BrowserSessionId, ProjectId, UserId, WebmateSeleniumSessionId } from "../types";
import { Browser } from "../browser";

/**
 * Representation of a Selenium session in webmate.
 */
export class SeleniumSession {

    constructor(public readonly id: WebmateSeleniumSessionId,
                public readonly userId: UserId,
                public readonly browser: Browser,
                public readonly usingProxy: boolean,
                public readonly state: string,
                public readonly seleniumCapabilities: any,
                public readonly projectId: ProjectId,
                public readonly browserSessionId: BrowserSessionId,
                public readonly errorMessage: string) {
    }
}
