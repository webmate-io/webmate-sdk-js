import {JsonSerializable} from "./json-serializable";

export class SimpleJsonNode implements JsonSerializable {
    constructor(public readonly e: any) {}

    asJson(): any {
        return this.e;
    }
}
