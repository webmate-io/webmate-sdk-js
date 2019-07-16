import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {JobConfigName, JobId, JobRunId, ProjectId} from "../types";
import {JobInput} from "./job-input";
import {Observable} from "rxjs";
import {Map} from "immutable";
import {JobRunSummary} from "./job-types";

export class JobEngine {
    private apiClient: JobEngineApiClient = new JobEngineApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {

    }


    public startJob(jobConfigName: JobConfigName, nameForJobInstance: string, inputValues: Object, projectId: ProjectId): Promise<any> {
        return this.apiClient.createJob(projectId, jobConfigName, nameForJobInstance, inputValues).toPromise().then(jobId => {
            return this.apiClient.startExistingJob(jobId).toPromise();
        }, error => {
            return Promise.reject(error);
        })
    }

    public startKnownJob(nameForJobInstance: string, input: JobInput, projectId: ProjectId): Promise<any> {
        return this.apiClient.createJob(projectId, input.name, nameForJobInstance, input.values).toPromise().then(jobId => {
            return this.apiClient.startExistingJob(jobId).toPromise();
        }, error => {
            return Promise.reject(error);
        })
    }

    public getSummaryOfJobRun(jobRunId: JobRunId): Observable<JobRunSummary> {
        return this.apiClient.getSummariesOfJobRun(jobRunId);
    }
}

class JobEngineApiClient extends WebmateAPIClient {
    createJobTemplate: UriTemplate = new UriTemplate("/projects/${projectId}/job/jobs");
    startJobTemplate: UriTemplate = new UriTemplate("/job/jobs/${jobId}/jobruns");
    jobRunsForJobTemplate: UriTemplate = new UriTemplate("/job/jobs/${jobId}/jobruns");
    jobRunSummaryTemplate: UriTemplate = new UriTemplate("/job/jobruns/${jobRunId}/summary");
    jobsForProjectTemplate: UriTemplate = new UriTemplate("/projects/${projectId}/job/jobs");

    constructor(authInfo: WebmateAuthInfo, environment: WebmateEnvironment) {
        super(authInfo, environment);
    }

    public createJob(projectId: ProjectId, jobConfigName: JobConfigName, name: string, inputValues: Object) {
        let params = Map({
            "projectId": projectId
        });

        let body = {
            nameForJobInstance: name,
            inputValues: inputValues,
            scheduling: {jobSchedulingSpec: {ExecuteLater: {}}},
            jobConfigIdOrName: jobConfigName
        };
        return this.sendPOST(this.createJobTemplate, params, body);
    }

    public startExistingJob(jobId: JobId) {
        let params = Map({
            "jobId": jobId
        });

       return this.sendPOST(this.startJobTemplate, params);
    }

    public getJobRunsForJob(jobId: JobId) {
        let params = Map({
            "jobId": jobId
        });

        return this.sendGET(this.jobRunsForJobTemplate, params);
    }

    public getSummariesOfJobRun(jobRunId: JobRunId) {
        let params = Map({
            "jobRunId": jobRunId
        });

        return this.sendGET(this.jobRunSummaryTemplate, params);
    }

}




