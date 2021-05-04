import {URL} from "url";

export class WebmateEnvironment {
    public baseUri: URL;

    constructor(public uri: string = "https://app.webmate.io/api/v1") {
        this.baseUri = new URL(uri);
    }

}
