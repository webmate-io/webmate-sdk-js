import {WMDataType} from "./wm-data-type";
import {WMValue} from "./wm-value";
import {BrowserSessionId} from "../types";
import {ExpeditionSpec} from "../browsersession/expedition-spec";
import {JsonSerializableArray} from "../json-serializable-array";
import {JsonSerializable} from "../json-serializable";
import {SimpleJsonNode} from "../simple-json-node";

export class WMValueFactory {

    public static makeBrickValue(dataType: WMDataType, value: JsonSerializable): WMValue {
        return new WMValue(dataType, value);
    }

    public static makeExpeditionId(id: BrowserSessionId): WMValue {
        let textNode = new SimpleJsonNode(id);
        return WMValueFactory.makeBrickValue(WMDataType.ExpeditionId, textNode);
    }

    public static makeExpeditionSpec(expeditionSpec: ExpeditionSpec): WMValue {
        return WMValueFactory.makeBrickValue(WMDataType.ExpeditionSpec, expeditionSpec);
    }

    public static makeExpeditionSpecList(expeditionSpecs: JsonSerializableArray<ExpeditionSpec>): WMValue {
        return WMValueFactory.makeBrickValue(WMDataType.ListExpeditionSpec,
            new JsonSerializableArray(...expeditionSpecs.map(spec => WMValueFactory.makeExpeditionSpec(spec))));
    }

}
