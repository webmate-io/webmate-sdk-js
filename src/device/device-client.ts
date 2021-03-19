import {WebmateAPISession} from "../webmate-api-session";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {DeviceId, ImageId, PackageId, ProjectId} from "../types";
import {Observable} from "rxjs";
import {Map} from "immutable";
import {DeviceRequest} from "./device-request";
import {DeviceDTO} from "./device-dto";
import {ImageType} from "../packagemgmt/image-type";
import {map, mergeMap} from "rxjs/operators";
import {ImagePool} from "../packagemgmt/image-pool";
import {CapabilityConstants} from "./CapabilityConstants";

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

    /**
     * Install the app wit the given Id on a device. If instrumented is set to true, the instrumented version will be
     * used if available.
     *
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     * @param appId Id of app to be installed. Can be found in App management of the webmate device overview.
     * @param instrumented If true, the instrumented version of the app will be installed, if available.
     */
    installAppOnDevice(deviceId: DeviceId, appId: PackageId, instrumented: boolean = false): Observable<void> {
        return this.apiClient.installAppOnDevice(deviceId, appId, instrumented);
    }

    /**
     * Uploads am image to webmate. The image is defined by the given byte array and specified by the imageType. The
     * uploaded image can be referenced by the returned image id.
     *
     * @param projectId Id of Project (as found in dashboard), for which devices should be retrieved.
     * @param imageFilePath File path to image file.
     * @param imageName Desired name of the image.
     * @param imageType Image format type.
     * @return Id of the uploaded image.
     */
    uploadImage(projectId: ProjectId, imageFilePath: string, imageName: string, imageType: ImageType): Observable<ImageId> {
        return this.apiClient.uploadImage(projectId, imageFilePath, imageName, imageType);
    }

    /**
     * Uploads an image to a device. The image is identified by the given image id. The image must have been uploaded
     * to webmate before
     *
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     * @param imageId Id of the image to be pushed to device.
     */
    uploadImageToDevice(deviceId: DeviceId, imageId: ImageId): Observable<void> {
        return this.apiClient.uploadImageToDevice(deviceId, imageId);
    }

    /**
     * Uploads an image to webmate and pushes it to a device. The image is defined by the given byte array and specified
     * by the imageType. The uploaded image can be referenced by the returned image id.
     *
     * @param projectId Id of Project (as found in dashboard), for which devices should be retrieved.
     * @param imageFilePath File path to image file.
     * @param imageName Desired name of the image.
     * @param imageType Image format type.
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     * @return Id of the uploaded image.
     */
    uploadImageToDeviceWithFilePath(projectId: ProjectId, imageFilePath: string, imageName: string, imageType: ImageType,
                                    deviceId: DeviceId): Observable<ImageId> {
        return this.apiClient.uploadImageToDeviceWithFilePath(projectId, imageFilePath, imageName, imageType, deviceId);
    }

    /**
     * Configure the camera simulation to use the given selectedImageId. The simulation can be enabled or disabled.
     *
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     * @param selectedImageId Image id of an already uploaded image. The parameter sets the image that is to be used for
     *                        the camera simulation. It can also be null to reset the selected image.
     * @param simulate Disables or enables the camera simulation.
     */
    setCameraSimulation(deviceId: DeviceId, selectedImageId: ImageId, simulate: boolean): Observable<void> {
        return this.apiClient.setCameraSimulation(deviceId, selectedImageId, simulate, new ImagePool(selectedImageId));
    }

    /**
     * Uploads an image to webmate, pushes it to a device and configures the camera simulation to use the image. The
     * image is defined by the given byte array and specified by the imageType. The uploaded image can be referenced by
     * the returned image id. The camera simulation will be enabled.
     *
     * @param projectId Id of Project (as found in dashboard), for which devices should be retrieved.
     * @param imageFilePath File path to image file.
     * @param imageName Desired name of the image.
     * @param imageType Image format type.
     * @param deviceId DeviceId of device. Can be found in "Details" dialog of an item in webmate device overview.
     * @return Id of the uploaded image.
     */
    public uploadImageToDeviceAndSetForCameraSimulationWithFilePath(projectId: ProjectId, imageFilePath: string,
                                                                    imageName: string, imageType: ImageType,
                                                                    deviceId: DeviceId): Observable<ImageId> {

        return this.apiClient.uploadImageToDeviceWithFilePath(projectId, imageFilePath, imageName, imageType, deviceId).pipe(
            mergeMap(imageId => {
                return this.apiClient.setCameraSimulation(deviceId, imageId, true, new ImagePool(imageId)).pipe(map(_ => imageId));
            })
        );
    }

}

export class DeviceApiClient extends WebmateAPIClient {

    private getDeviceIdsForProjectRoute = new UriTemplate("/projects/${projectId}/device/devices");
    private requestDeviceByRequirementsForProjectRoute = new UriTemplate("/projects/${projectId}/device/devices");
    private synchronizeDeviceRoute = new UriTemplate("/device/devices/${deviceId}/sync");
    private releaseDeviceRoute = new UriTemplate("/device/devices/${deviceId}");
    private redeployDeviceRoute = new UriTemplate("/device/devices/${deviceId}/redeploy");

    private installAppOnDeviceRoute = new UriTemplate("/device/${deviceId}/appinstall/${packageId}");
    private uploadImageRoute = new UriTemplate("/projects/${projectId}/images");
    private uploadImageToDeviceRoute = new UriTemplate("/device/${deviceId}/image/${imageId}");
    private setCameraSimulationRoute = new UriTemplate("/device/devices/${deviceId}/capabilities");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public getDeviceIdsForProject(projectId: ProjectId): Observable<Array<DeviceId>> {
        return this.sendGET(this.getDeviceIdsForProjectRoute, Map({"projectId": projectId}));
    }

    public requestDeviceByRequirements(projectId: ProjectId, deviceRequest: DeviceRequest): Observable<DeviceDTO> {
        return this.sendPOST(this.requestDeviceByRequirementsForProjectRoute, Map({"projectId": projectId}), deviceRequest.asJson());
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

    installAppOnDevice(deviceId: DeviceId, appId: PackageId, instrumented: boolean): Observable<void> {
        let params = Map({
            "deviceId": deviceId,
            "packageId": appId
        });
        let queryParams = Map({
            "wait": "true",
            "instrumented": String(instrumented)
        });

        return this.sendPOST(this.installAppOnDeviceRoute, params, undefined, queryParams);
    }

    uploadImage(projectId: ProjectId, imageFilePath: string, imageName: string, imageType: ImageType): Observable<ImageId> {
        let contentType = "image/" + imageType;
        let params = Map({
            "projectId": projectId
        });
        let queryParams = Map({
            "name": imageName
        });

        return this.sendPOSTWithFile(this.uploadImageRoute, imageFilePath, params, contentType, queryParams);
    }

    uploadImageToDevice(deviceId: DeviceId, imageId: ImageId): Observable<void> {
        let params = Map({
            "deviceId": deviceId,
            "imageId": imageId
        });
        return this.sendPOST(this.uploadImageToDeviceRoute, params);
    }

    uploadImageToDeviceWithFilePath(projectId: ProjectId, imageFilePath: string, imageName: string, imageType: ImageType,
                                    deviceId: DeviceId): Observable<ImageId> {
        return this.uploadImage(projectId, imageFilePath, imageName, imageType).pipe(
            mergeMap(imageId => {
                return this.uploadImageToDevice(deviceId, imageId).pipe(map(_ => {
                    return imageId;
                }));
            })
        );
    }

    setCameraSimulation(deviceId: DeviceId, imageId: ImageId, simulate: boolean, imagePool: ImagePool): Observable<void> {
        if (!imagePool.contains(imageId)) {
            throw new Error(`The given image pool must contain the passed image id.`);
        }
        let params = Map({
            "deviceId": deviceId
        });
        let body: any = {};
        let selectedImageId = !imageId ? null : imageId;
        body[CapabilityConstants.SIMULATE_CAMERA] = {
            "enabled": simulate,
            "selectedImage": selectedImageId
        };
        body[CapabilityConstants.MEDIA_SETTINGS] = imagePool.asJson();

        return this.sendPOST(this.setCameraSimulationRoute, params, body);
    }

}
