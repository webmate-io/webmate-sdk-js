export class BrowserSessionWarmUpConfig {
    public constructor(public pageWarmUpScrollBy: number = 2000,
                       public pageWarmUpScrollDelay: number = 3000,
                       public pageWarmUpMaxScrolls: number = 10) {
    }
}
