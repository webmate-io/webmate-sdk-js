/**
 * Represents a Tag in webmate. A Tag has a string-valued key and an arbitrary value, which is represented as a Json
 * node.
 */
export class Tag {

    public readonly value: any;

    constructor(public readonly name: string, value?: any) {
        if (!!value) {
            this.value = value;
        } else {
            value = true;
        }
    }

}
