import {WebmateAPISession} from "../webmate-api-session";
import {UriTemplate, WebmateAPIClient} from "../webmate-api-client";
import {WebmateAuthInfo} from "../webmate-auth-info";
import {WebmateEnvironment} from "../webmate-environment";
import {JobConfigName, JobId, JobRunId, ProjectId} from "../types";
import {WellKnownJobInput} from "./well-known-job-input";
import {Observable} from "rxjs";
import {List, Map} from "immutable";
import {JobRunSummary} from "./job-run-summary";
import {map, mergeMap} from "rxjs/operators";

/**
 * Facade to webmate's JobEngine subsystem.
 */
export class JobEngine {
    private apiClient: JobEngineApiClient = new JobEngineApiClient(this.session.authInfo, this.session.environment);

    constructor(private session: WebmateAPISession) {}

    /**
     * Create a new webmate Job and directly start a new JobRun for this Job.
     *
     * @param jobConfigName  Name of new JobConfig.
     * @param nameForJobInstance Name describing JobRun.
     * @param inputValues Input values for Job.
     * @param projectId ProjectId of Project where Job should be started in.
     * @return Id of new JobRun
     */
    public startJob(jobConfigName: JobConfigName, nameForJobInstance: string, inputValues: Object, projectId: ProjectId): Observable<JobRunId> {
        return this.apiClient.createJob(projectId, jobConfigName, nameForJobInstance, inputValues).pipe(mergeMap(jobId => {
            return this.apiClient.startExistingJob(jobId);
        }));
    }

    /**
     * Create a new webmate Job and directly start a new JobRun for this Job.
     *
     * @param nameForJobInstance Name describing JobRun.
     * @param input Configuration of one of webmate well-known Jobs, e.g. CrossbrowserLayoutAnalysis.
     * @param projectId ProjectId of Project where Job should be started in.
     * @return Id of new JobRun
     */
    public startKnownJob(nameForJobInstance: string, input: WellKnownJobInput, projectId: ProjectId): Observable<JobRunId> {
        return this.apiClient.createJob(projectId, input.name, nameForJobInstance, input.values).pipe(mergeMap(jobId => {
            return this.apiClient.startExistingJob(jobId);
        }));
    }

    /**
     * Start a Job which already exists. (i.e. to run a Job again).
     *
     * @param id Id of the Job to run.
     * @return The id of the JobRun that was created
     */
    public startExistingJob(jobId: JobId): Observable<JobRunId> {
        return this.apiClient.startExistingJob(jobId);
    }

    /**
     * Return list of JobRunIds for the given JobId.
     *
     * @param jobId Id of Job, for which JobRuns should be retrieved.
     * @return List of JobRun ids
     */
    public getJobRunsForJob(jobId: JobId): Observable<List<JobRunId>> {
        return this.apiClient.getJobRunsForJob(jobId);
    }

    /**
     * Get the current state summary of the JobRun with the given JobRunId.
     *
     * @param jobRunId Id of the JobRun for which the current state should be retrieved.
     * @return Summary of the current state of the JobRun
     */
    public getSummaryOfJobRun(jobRunId: JobRunId): Observable<JobRunSummary> {
        return this.apiClient.getSummaryOfJobRun(jobRunId);
    }

    /**
     * Get all existing jobs in the specified project.
     *
     * @param projectId id of the project that jobs should be retrieved for.
     * @return List of Job ids
     */
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




