import {WMDataType} from "./wm-data-type";
import {WMValue} from "./wm-value";
import {BrowserSessionId} from "../types";
import {List} from "immutable";
import {ExpeditionSpec} from "../browsersession/expedition-spec";

export class WMValueFactory {

    public static makeBrickValue(dataType: WMDataType, value: any): WMValue {
        return new WMValue(dataType, value);
    }

    public static makeExpeditionId(id: BrowserSessionId): WMValue {
        return WMValueFactory.makeBrickValue(WMDataType.ExpeditionId, {id});
    }

    public static makeExpeditionSpec(expeditionSpec: ExpeditionSpec): WMValue {
        return WMValueFactory.makeBrickValue(WMDataType.ExpeditionSpec, expeditionSpec);
    }

    public static makeExpeditionSpecList(expeditionSpecs: List<ExpeditionSpec>): WMValue {
        return WMValueFactory.makeBrickValue(WMDataType.ListExpeditionSpec, expeditionSpecs);
    }

}
