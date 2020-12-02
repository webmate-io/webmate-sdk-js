export class BrowserSessionScreenshotExtractionConfig {
    public constructor(public fullPage: boolean = true,
                       public hideFixedElements: boolean = true,
                       public useTranslateYScrollStrategy: boolean = false) {
    }
}
