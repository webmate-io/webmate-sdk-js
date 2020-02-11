import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {JobConfigName, JobId, JobRunId, ProjectId} from "../types";
import {WellKnownJobInput} from "./well-known-job-input";
import {Observable} from "rxjs";
import {List, Map} from "immutable";
import {JobRunSummary} from "./job-types";
import {map, mergeMap} from "rxjs/operators";

export class JobEngine {
    private apiClient: JobEngineApiClient = new JobEngineApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {

    }


    public startJob(jobConfigName: JobConfigName, nameForJobInstance: string, inputValues: Object, projectId: ProjectId): Observable<JobRunId> {
        return this.apiClient.createJob(projectId, jobConfigName, nameForJobInstance, inputValues).pipe(mergeMap(jobId => {
            return this.apiClient.startExistingJob(jobId);
        }));
    }

    public startKnownJob(nameForJobInstance: string, input: WellKnownJobInput, projectId: ProjectId): Observable<JobRunId> {
        return this.apiClient.createJob(projectId, input.name, nameForJobInstance, input.values).pipe(mergeMap(jobId => {
            return this.apiClient.startExistingJob(jobId);
        }));
    }

    public startExistingJob(jobId: JobId): Observable<JobRunId> {
        return this.apiClient.startExistingJob(jobId);
    }

    public getJobRunsForJob(jobId: JobId): Observable<List<JobRunId>> {
        return this.apiClient.getJobRunsForJob(jobId);
    }

    public getSummaryOfJobRun(jobRunId: JobRunId): Observable<JobRunSummary> {
        return this.apiClient.getSummaryOfJobRun(jobRunId);
    }

    public getJobsInProject(projectId: ProjectId): Observable<List<JobId>> {
        return this.apiClient.getJobsInProject(projectId);
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

    public createJob(projectId: ProjectId, jobConfigName: JobConfigName, name: string, inputValues: Object): Observable<JobId> {
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

    public startExistingJob(jobId: JobId): Observable<JobRunId> {
        let params = Map({
            "jobId": jobId
        });

       return this.sendPOST(this.startJobTemplate, params);
    }

    public getJobRunsForJob(jobId: JobId): Observable<List<JobRunId>> {
        let params = Map({
            "jobId": jobId
        });

        return this.sendGET(this.jobRunsForJobTemplate, params).pipe(map(arr => List(arr)));
    }

    public getSummaryOfJobRun(jobRunId: JobRunId): Observable<JobRunSummary> {
        let params = Map({
            "jobRunId": jobRunId
        });

        return this.sendGET(this.jobRunSummaryTemplate, params);
    }

    public getJobsInProject(projectId: ProjectId): Observable<List<JobId>> {
        let params = Map({
            "projectId": projectId
        });

        return this.sendGET(this.jobsForProjectTemplate, params).pipe(map(arr => List(arr)));
    }

}




