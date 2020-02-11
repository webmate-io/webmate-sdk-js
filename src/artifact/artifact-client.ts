import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {ArtifactId, BrowserSessionId, DateTime, ProjectId, TestRunId} from "../types";
import {Observable} from "rxjs";
import {Artifact, ArtifactInfo, ArtifactType} from "./artifact-types";
import {Map} from "immutable";

export class ArtifactClient {

    private apiClient = new ArtifactApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {}

    public queryArtifacts(id: ProjectId, artifactTypes: Array<ArtifactType>, associatedTestRun?: TestRunId, associatedBrowserSession?: BrowserSessionId): Observable<Array<ArtifactInfo>> {
        return this.apiClient.queryArtifacts(id, artifactTypes, associatedTestRun, associatedBrowserSession);
    }

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
