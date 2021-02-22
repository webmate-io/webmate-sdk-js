import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {ArtifactId, BrowserSessionId, DateTime, ProjectId, TestRunId} from "../types";
import {Observable} from "rxjs";
import {Artifact, ArtifactInfo, ArtifactType} from "./artifact-types";
import {Map} from "immutable";

/**
 * Facade to webmate's Artifact subsystem.
 */
export class ArtifactClient {

    private apiClient = new ArtifactApiClient(this.session.authInfo, this.session.environment);

    /**
     * Creates an ArtifactClient based on a WebmateApiSession.
     *
     * @param session The WebmateApiSession used by the ArtifactClient
     */
    constructor(private session: WebmateAPISession) {}

    /**
     * Retrieve Artifact infos associated with test run and browser session in project.
     *
     * @param id project id
     * @param artifactTypes Types of artifacts to retrieve. If empty, artifacts of all types are retrieved.
     * @param associatedTestRun testRunId associated with artifacts. (Optional)
     * @param associatedBrowserSession browserSessionId associated with artifacts. (Optional)
     * @return artifactInfo array
     */
    public queryArtifacts(id: ProjectId, artifactTypes: Array<ArtifactType>, associatedTestRun?: TestRunId, associatedBrowserSession?: BrowserSessionId): Observable<Array<ArtifactInfo>> {
        return this.apiClient.queryArtifacts(id, artifactTypes, associatedTestRun, associatedBrowserSession);
    }

    /**
     * Retrieve Artifact with id.
     *
     * @param id Id of Artifact.
     * @return Artifact
     */
    public getArtifact(id: ArtifactId): Observable<Artifact> {
        return this.apiClient.getArtifact(id);
    }
}

export class ArtifactApiClient extends WebmateAPIClient {

    private queryArtifactsTemplate = new UriTemplate("/projects/${projectId}/artifacts");
    private getArtifactTemplate = new UriTemplate("/artifact/artifacts/${artifactId}");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public queryArtifacts(id: ProjectId, artifactTypes: Array<ArtifactType>, associatedTestRun?: TestRunId, associatedBrowserSession?: BrowserSessionId): Observable<Array<ArtifactInfo>> {

        let params = Map({
            projectId: id
        });

        let queryparams: any = {};
        if (associatedTestRun) queryparams['testRunId'] = associatedTestRun;
        if (associatedBrowserSession) queryparams['browserSessionId'] = associatedBrowserSession;

        if (artifactTypes.length > 0) {
            queryparams["types"] = artifactTypes.map(t => t.asSerializedString()).join(",");
        }

        return this.sendGET(this.queryArtifactsTemplate, params, Map(queryparams));
    }

    public getArtifact(id: ArtifactId): Observable<Artifact> {
        return this.sendGET(this.getArtifactTemplate, Map({"artifactId": id}));
    }

}
