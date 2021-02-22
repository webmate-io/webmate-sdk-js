import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {BlobId, ProjectId} from "../types";
import {Observable} from "rxjs";
import {Map} from "immutable";

/**
 * Facade to webmate's Blob subsystem.
 */
export class BlobClient {

    private apiClient = new BlobApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {}

    public putBlob(projectId: ProjectId, filePath: string, contentType?: string): Observable<BlobId> {
        return this.apiClient.putBlob(projectId, filePath, contentType);
    }

    public deleteBlob(blobId: BlobId): void {
        this.apiClient.deleteBlob(blobId);
    }

}

export class BlobApiClient extends WebmateAPIClient {

    private putBlobTemplate = new UriTemplate("/projects/${projectId}/blobs");
    private deleteBlobTemplate = new UriTemplate("/blobs/${blobId}");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public putBlob(projectId: ProjectId, filePath: string, contentType?: string): Observable<BlobId> {
        let params = Map({
            projectId: projectId
        });
        return this.sendPOSTWithFile(this.putBlobTemplate, filePath, params, contentType);
    }

    public deleteBlob(blobId: BlobId): void {
        this.sendDELETE(this.deleteBlobTemplate, Map({"blobId": blobId}));
    }

}
