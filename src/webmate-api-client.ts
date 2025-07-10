import {WebmateAuthInfo} from "./webmate-auth-info";
import {WebmateEnvironment} from "./webmate-environment";
import {URL} from "url";
import {Map} from "immutable";
import {Observable, from} from "rxjs";
import * as fs from "fs";
import axios, {AxiosRequestConfig} from "axios";
import {map} from "rxjs/operators";

/**
 * API client for interacting with the webmate API.
 */
export class WebmateAPIClient {

    constructor(private authInfo: WebmateAuthInfo, private environment: WebmateEnvironment) {}

    private getRequestConfig(urlParams?: Map<string, string>, contentType?: string): AxiosRequestConfig {
        const config: AxiosRequestConfig = {
            headers: {
                'User-Agent': 'webmate-js-sdk',
                'webmate.api-token': this.authInfo.apiKey,
                'content-type': 'application/json',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        };

        if (!!urlParams) {
            config['params'] = {};
            urlParams.forEach((value, key) => {
                config.params[key || ""] = value;
            });

        }

        if (!!contentType) {
            config.headers!['content-type'] = contentType;
        }

        return config;
    }

    public sendGET(schema: UriTemplate, params: Map<string, string>, urlParams?: Map<string, string>): Observable<any> {
        let config = this.getRequestConfig(urlParams);

        return from(axios.get(schema.buildUri(this.environment.baseUri, params), config)).pipe(
            map((response: any) => {
                return response.data
            })
        );
    }

    public sendPOST(schema: UriTemplate, params: Map<string, string>, body?: Object, urlParams?: Map<string, string>): Observable<any> {
        let config = this.getRequestConfig(urlParams);

        return from(axios.post(schema.buildUri(this.environment.baseUri, params), body, config)).pipe(
            map((response: any) => {
                return response.data
            })
        );
    }

    public sendPOSTWithFile(schema: UriTemplate, filePath: string, params: Map<string, string>, contentType?: string, urlParams?: Map<string, string>): Observable<any> {
        let readmeStream = fs.createReadStream(filePath);
        let config = this.getRequestConfig(urlParams, contentType);

        return from(axios.post(schema.buildUri(this.environment.baseUri, params), readmeStream, config)).pipe(
            map((response: any) => {
                return response.data;
            })
        );
    }

    public sendPOSTStreamResponse(schema: UriTemplate, params: Map<string, string>, body?: Object, urlParams?: Map<string, string>): Observable<any> {
        let config = this.getRequestConfig(urlParams);
        config["responseType"] = "stream";

        return from(axios.post(schema.buildUri(this.environment.baseUri, params), body, config)).pipe(
            map((response: any) => {
                return response.data
            })
        );
    }

    public sendDELETE(schema: UriTemplate, params: Map<string, string>): Observable<any> {
        let config = this.getRequestConfig();
        return from(axios.delete(schema.buildUri(this.environment.baseUri, params), config));
    }

}

/**
 * Template for API URI, e.g. "/browsersessions/${browserSessionId}"
 */
export class UriTemplate {

    constructor(public readonly schema: string, public readonly name?: string) {}

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

export interface ApiPaginationInfo {
  nextLink?: string,
  prevLink?: string,
}

export interface PaginatedApiResult<T> {
  links?: ApiPaginationInfo,
  data: Array<T>
}
