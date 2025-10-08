import {BrowserSessionStateId} from "../types";
import {BrowserSessionScreenshotExtractionConfig} from "./browser-session-screenshot-extraction-config";
import {BrowserSessionWarmUpConfig} from "./browser-session-warm-up-config";
import {Dimension} from "../commonutils/Dimension";
import {FactRequest} from "./factrequest";

export class BrowserSessionStateExtractionConfig {
    public constructor(public stateId?: BrowserSessionStateId,
                       public extractionDelay?: number,
                       public extractionCooldown?: number,
                       public optViewportDimension?: Dimension,
                       public maxAdditionWaitingTimeForStateExtraction?: number,
                       public extractDomStateData?: boolean,
                       public screenShotConfig?: BrowserSessionScreenshotExtractionConfig,
                       public warmUpConfig?: BrowserSessionWarmUpConfig,
                       public requestedFacts?: FactRequest[]) {
    }
}
