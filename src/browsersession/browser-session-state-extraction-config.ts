import {BrowserSessionStateId} from "../types";

export class BrowserSessionStateExtractionConfig {

    public constructor(public stateId?: BrowserSessionStateId,
                       public extractionDelay: number = 10000,
                       public extractionCooldown: number = 2000,
                       public maxAdditionalWaitingTimeForStateExtraction: number = 120000,
                       public extractDomStateData: boolean = true,
                       public warmUpConfig: WarmUpConfig = new WarmUpConfig(),
                       public screenShotConfig: ScreenshotConfig = new ScreenshotConfig(),
                       public optViewPortDimension?: OptViewPortDimension) {
    }
}

export class ScreenshotConfig {
    public constructor(public fullPage: boolean = true,
                       public hideFixedElements: boolean = true,
                       public useTranslateYScrollStrategy: boolean = false) {
    }
}


export class WarmUpConfig {
    public constructor(public pageWarmUpScrollBy: number = 2000,
                       public pageWarmUpScrollDelay: number = 3000,
                       public pageWarmUpMaxScrolls: number = 10) {
    }
}

export class OptViewPortDimension {
    public constructor(public width: number,
                       public height: number) {

    }
}
