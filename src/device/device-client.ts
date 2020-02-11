import {WebmateAPISession} from "../webmate-api-session";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {DeviceId, DeviceTemplateId, ProjectId} from "../types";
import {Observable} from "rxjs";
import {List, Map} from "immutable";
import {DeviceTemplate} from "./device-types";


export class DeviceClient {

    private apiClient: DeviceApiClient = new DeviceApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {}

    public getDeviceTemplatesForProject(projectId: ProjectId): Observable<Array<DeviceTemplate>> {
        return this.apiClient.getDeviceTemplatesForProject(projectId);
    }

    public getDeviceIdsForProject(projectId: ProjectId): Observable<Array<DeviceId>> {
        return this.apiClient.getDeviceIdsForProject(projectId);
    }

    public synchronizeDevice(deviceId: DeviceId) {
        return this.apiClient.synchronizeDevice(deviceId);
    }

    public redeployDevice(deviceId: DeviceId) {
        return this.apiClient.redeployDevice(deviceId);
    }

    public releaseDevice(deviceId: DeviceId) {
        return this.apiClient.releaseDevice(deviceId);
    }

    public requestDeviceByTemplate(projectId: ProjectId, templateId: DeviceTemplateId) {
        return this.apiClient.requestDeviceByTemplate(projectId, templateId);
    }

}

export class DeviceApiClient extends WebmateAPIClient {

    private getDeviceIdsForProjectTemplate = new UriTemplate("/projects/${projectId}/device/devices");

    private getDeviceTemplatesForProjectTemplate = new UriTemplate("/projects/${projectId}/device/templates");

    private synchronizeDeviceTemplate = new UriTemplate("/device/devices/${deviceId}/sync");

    private releaseDeviceTemplate = new UriTemplate("/device/devices/${deviceId}");

    private redeployDeviceTemplate = new UriTemplate("/device/devices/${deviceId}/redeploy");

    private requestDeviceTemplate = new UriTemplate("/projects/${projectId}/device/devices");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public getDeviceTemplatesForProject(projectId: ProjectId): Observable<Array<DeviceTemplate>> {
        return this.sendGET(this.getDeviceTemplatesForProjectTemplate, Map({"projectId": projectId}));
    }

    public getDeviceIdsForProject(projectId: ProjectId): Observable<Array<DeviceId>> {
        return this.sendGET(this.getDeviceIdsForProjectTemplate, Map({"projectId": projectId}));
    }

    public synchronizeDevice(deviceId: DeviceId) {
        return this.sendPOST(this.synchronizeDeviceTemplate, Map({"deviceId": deviceId}));
    }

    public redeployDevice(deviceId: DeviceId) {
        return this.sendPOST(this.redeployDeviceTemplate, Map({"deviceId": deviceId}));
    }

    public releaseDevice(deviceId: DeviceId) {
        return this.sendDELETE(this.releaseDeviceTemplate, Map({"deviceId": deviceId}));
    }

    public requestDeviceByTemplate(projectId: ProjectId, templateId: DeviceTemplateId) {
        return this.sendPOST(this.requestDeviceTemplate, Map({"projectId": projectId}),{"templateId": templateId});
    }
}
