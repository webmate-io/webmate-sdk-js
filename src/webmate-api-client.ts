import {WebmateAuthInfo} from "./webmate-auth-info";
import {WebmateEnvironment} from "./webmate-environment";
import * as request from "request-promise-native";
import {URL} from "url";
import {Map} from "immutable";
import {Observable, from as observableFrom} from "rxjs";



export class WebmateAPIClient {

    constructor(private authInfo: WebmateAuthInfo, private environment: WebmateEnvironment) {}

    private prepareRequest(schema: UriTemplate, params: Map<string, string>, body?: Object, urlParams?: Map<string, string>) {
        let options: any = {
            uri: schema.buildUri(this.environment.baseUri, params),
            headers: {
                'User-Agent': 'webmate-js-sdk',
                'webmate.user': this.authInfo.emailAddress,
                'webmate.api-token': this.authInfo.apiKey,
                'content-type': 'application/json',
                'accept': ''
            },
            json: true // Automatically parses the JSON string in the response
        };


        if (urlParams !== undefined) {
            options['qs'] = {};

            urlParams.forEach((value, key) => {
                options.qs[key || ""] = value;
            });
        }

        if (body !== undefined) {
            options['body'] = body;
        }

        return options;
    }



    public sendGET(schema: UriTemplate, params: Map<string, string>, urlParams?: Map<string, string>): Observable<any> {
        let options = this.prepareRequest(schema, params, undefined, urlParams);
        return observableFrom(request.get(options).promise());
    }

    public sendPOST(schema: UriTemplate, params: Map<string, string>, body?: Object, urlParams?: Map<string, string>): Observable<any> {
        let options = this.prepareRequest(schema, params, body, urlParams);
        return observableFrom(request.post(options).promise());
    }

    public sendDELETE(schema: UriTemplate, params: Map<string, string>): Observable<any> {
        let options = this.prepareRequest(schema, params);
        return observableFrom(request.delete(options).promise());
    }

}

export class UriTemplate {

    constructor(public schema: string) {}

    replaceParamsInTemplate(template: string, params: Map<string, string>): string {
        let paramPrologue = "${";
        let paramEpilogue = "}";

        params.forEach((value, key) => {
            template = template.replace(paramPrologue + key + paramEpilogue, value || "");
        });

        if (template.indexOf(paramPrologue) !== -1) {
            throw new Error("At least one parameter of [" + params.keys() + "] could not be matched in schema " + template);
        }

        return template;
    }

    buildUri(baseUri: URL, params: Map<string, string>): string {
        let schemaAfterReplacements = this.replaceParamsInTemplate(this.schema, params);
        let uri = new URL(baseUri + schemaAfterReplacements);

        return uri.toString();
    }
}
