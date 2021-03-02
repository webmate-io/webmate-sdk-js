import {JsonSerializable} from "./json-serializable";

export class JsonSerializableArray<T extends JsonSerializable> extends Array<T> implements JsonSerializable {
    asJson: () => any = function() {
        let a: Array<any> = [];
        // @ts-ignore
        this.forEach(e => {
            a.push(e.asJson());
        });
        return a;
    }
}
