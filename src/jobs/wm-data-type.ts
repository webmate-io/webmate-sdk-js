export class WMDataType {

    public static readonly ExpeditionId = new WMDataType("BrowserSessionRef");
    public static readonly ExpeditionSpec = new WMDataType("ExpeditionSpec");
    public static readonly ListExpeditionSpec = new WMDataType("List[ExpeditionSpec]");
    public static readonly LiveExpeditionSpec = new WMDataType("LiveExpeditionSpec");
    public static readonly BrowserSpecification = new WMDataType("BrowserSpecification");
    public static readonly URLListDriverSpecification = new WMDataType("URLListDriverSpecification");

    constructor(public readonly tpe: string) {}

}
