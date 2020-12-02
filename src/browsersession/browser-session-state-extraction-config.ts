import {BrowserSessionStateId} from "../types";
import {BrowserSessionScreenshotExtractionConfig} from "./browser-session-screenshot-extraction-config";
import {BrowserSessionWarmUpConfig} from "./browser-session-warm-up-config";
import {Dimension} from "../commonutils/Dimension";

export class BrowserSessionStateExtractionConfig {
    public constructor(public stateId?: BrowserSessionStateId,
                       public extractionDelay: number = 10000,
                       public extractionCooldown: number = 2000,
                       public optViewportDimension?: Dimension,
                       public maxAdditionalWaitingTimeForStateExtraction: number = 120000,
                       public extractDomStateData: boolean = true,
                       public screenShotConfig: BrowserSessionScreenshotExtractionConfig = new BrowserSessionScreenshotExtractionConfig(),
                       public warmUpConfig: BrowserSessionWarmUpConfig = new BrowserSessionWarmUpConfig()) {
    }
}
