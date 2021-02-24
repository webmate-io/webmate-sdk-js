import {WebmateAPISession} from "../webmate-api-session";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {DeviceId, ProjectId} from "../types";
import {Observable} from "rxjs";
import {Map} from "immutable";
import {DeviceRequest} from "./device-request";
import {DeviceDTO} from "./device-dto";

/**
 * Facade to webmate's Device subsystem.
 */
export class DeviceClient {

    private apiClient: DeviceApiClient = new DeviceApiClient(this.session.authInfo, this.session.environment);

    /**
     * Creates a DeviceClient based on a WebmateApiSession.
     *
     * @param session The WebmateApiSession the DeviceClient is supposed to be based on.
     */
    constructor(private session: WebmateAPISession) {}

    /**
     * Get all Device ids for a project.
     *
     * @param projectId Id of Project (as found in dashboard), for which devices should be retrieved.
     * @return Collection of device ids.
     */
    public getDeviceIdsForProject(projectId: ProjectId): Observable<Array<DeviceId>> {
        return this.apiClient.getDeviceIdsForProject(projectId);
    }

    /**
     * Request a device deployment by the specified device request.
     *
     * @param projectId Id of Project (as found in dashboard), for which devices should be retrieved.
     * @param deviceRequest Contains the defined device properties.
     */
    public requestDeviceByRequirements(projectId: ProjectId, deviceRequest: DeviceRequest): Observable<DeviceDTO> {
        return this.apiClient.requestDeviceByRequirements(projectId, deviceRequest);
    }

    /**
     * Synchronize webmate with device. (Usually not necessary)
     *
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     */
    public synchronizeDevice(deviceId: DeviceId): Observable<void> {
        return this.apiClient.synchronizeDevice(deviceId);
    }

    /**
     * Release device. The device will not be deployed afterwards.
     *
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     */
    public releaseDevice(deviceId: DeviceId): Observable<void> {
        return this.apiClient.releaseDevice(deviceId);
    }

    /**
     * Redeploy device. The device will be released and redeployed with the same properties as before.
     *
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     */
    public redeployDevice(deviceId: DeviceId): Observable<void> {
        return this.apiClient.redeployDevice(deviceId);
    }

}

export class DeviceApiClient extends WebmateAPIClient {

    private getDeviceIdsForProjectRoute = new UriTemplate("/projects/${projectId}/device/devices");
    private requestDeviceByRequirementsForProjectRoute = new UriTemplate("/projects/${projectId}/device/devices");
    private synchronizeDeviceRoute = new UriTemplate("/device/devices/${deviceId}/sync");
    private releaseDeviceRoute = new UriTemplate("/device/devices/${deviceId}");
    private redeployDeviceRoute = new UriTemplate("/device/devices/${deviceId}/redeploy");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public getDeviceIdsForProject(projectId: ProjectId): Observable<Array<DeviceId>> {
        return this.sendGET(this.getDeviceIdsForProjectRoute, Map({"projectId": projectId}));
    }

    public requestDeviceByRequirements(projectId: ProjectId, deviceRequest: DeviceRequest): Observable<DeviceDTO> {
        return this.sendPOST(this.requestDeviceByRequirementsForProjectRoute, Map({"projectId": projectId}), deviceRequest);
    }

    public synchronizeDevice(deviceId: DeviceId): Observable<void> {
        return this.sendPOST(this.synchronizeDeviceRoute, Map({"deviceId": deviceId}));
    }

    public releaseDevice(deviceId: DeviceId): Observable<void> {
        return this.sendDELETE(this.releaseDeviceRoute, Map({"deviceId": deviceId}));
    }

    public redeployDevice(deviceId: DeviceId): Observable<void> {
        return this.sendPOST(this.redeployDeviceRoute, Map({"deviceId": deviceId}));
    }

    // TODO missing methods

}
