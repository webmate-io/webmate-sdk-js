import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {Observable} from "rxjs";
import {Package} from "./package";
import {BlobId, PackageId, ProjectId} from "../types";
import {Map} from "immutable";
import {mergeMap} from "rxjs/operators";
import {WebmateAPISession} from "../webmate-api-session";
import {BlobClient} from "../blobs/blob-client";

export class PackageMgmtClient {
    private apiClient: PackageMgmtApiClient = new PackageMgmtApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {
    }

    createPackage(projectId: ProjectId, blobId: BlobId, packageName: string, extension: string): Observable<Package> {
        return this.apiClient.createPackage(projectId, blobId, packageName, extension);
    }

    getPackage(packageId: PackageId): Observable<Package> {
        return this.apiClient.getPackage(packageId);
    }

    uploadPackage(projectId: ProjectId, filePath: string, packageName: string, extension: string): Observable<Package> {
        let contentType = extension === "apk" ? "application/vnd.android.package-archive" : "application/x-ios-app";
        let blobClient = new BlobClient(this.session);
        return blobClient.putBlob(projectId, filePath, contentType).pipe(mergeMap(blobId => {
            return this.createPackage(projectId, blobId, packageName, extension);
        }));
    }

}

class PackageMgmtApiClient extends WebmateAPIClient {
    private createPackageTemplate = new UriTemplate("/projects/${projectId}/packages");

    private getPackageTemplate = new UriTemplate("/package/packages/${packageId}");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    createPackage(projectId: ProjectId, blobId: BlobId, packageName: string, extension: string): Observable<Package> {
        let packageData = {
            "blobId": blobId,
            "name": packageName,
            "extension": extension
        };
        let params = Map({
            "projectId": projectId
        });

        return this.sendPOST(this.createPackageTemplate, params, packageData);
    }

    getPackage(packageId: PackageId): Observable<Package> {
        let params = Map({
            "packageId": packageId
        });
        return this.sendGET(this.getPackageTemplate, params);
    }

}
