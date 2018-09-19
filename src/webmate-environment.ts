import {URL} from "url";

export class WebmateEnvironment {
    public baseUri: URL;

    constructor(public uri: string = "https://api.webmate.io/v1") {
        this.baseUri = new URL(uri);
    }

}
