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

    /**
     * Creates a DeviceClient based on a WebmateApiSession.
     * @param session The WebmateApiSession the DeviceClient is supposed to be based on.
     */
    constructor(private session: WebmateAPISession) {}

    /**
     * Get all Device templates available in a project.
     *
     * @param projectId Id of Project (as found in dashboard), for which devices should be retrieved.
     * @return Templates available in project
     */
    public getDeviceTemplatesForProject(projectId: ProjectId): Observable<Array<DeviceTemplate>> {
        return this.apiClient.getDeviceTemplatesForProject(projectId);
    }

    /**
     * Get all Device ids for a project.
     * @param projectId Id of Project (as found in dashboard), for which devices should be retrieved.
     * @return Collection of device ids.
     */
    public getDeviceIdsForProject(projectId: ProjectId): Observable<Array<DeviceId>> {
        return this.apiClient.getDeviceIdsForProject(projectId);
    }

    /**
     * Synchronize webmate with device. (Usually not necessary)
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     */
    public synchronizeDevice(deviceId: DeviceId) {
        return this.apiClient.synchronizeDevice(deviceId);
    }

    /**
     * Redeploy device. The device will be released and redeployed with the same properties as before.
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     */
    public redeployDevice(deviceId: DeviceId) {
        return this.apiClient.redeployDevice(deviceId);
    }

    /**
     * Release device. The device will not be deployed afterwards.
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     */
    public releaseDevice(deviceId: DeviceId) {
        return this.apiClient.releaseDevice(deviceId);
    }

    /**
     * Deploy a new device given its TemplateId. The TemplateId can be retrieved from getDeviceTemplatesForProject.
     * @param projectId Project where the new device will be deployed in.
     * @param templateId Template that will be deployed.
     */
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
