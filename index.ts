import {WebmateAPISession} from "./src/webmate-api-session";
import {WebmateEnvironment} from "./src/webmate-environment";
import {WebmateAuthInfo} from "./src/webmate-auth-info";

export * from './src/types';
export * from './src/browsersession/browser-session-client';
export * from './src/browsersession/browser-session-state-extraction-config';
export * from './src/jobs/job-engine';
export * from './src/jobs/job-input';
export * from './src/jobs/jobconfigs/crossbrowser-job-input';
export * from './src/jobs/jobconfigs/regression-job-input';
export * from './src/webmate-api-session';
export * from './src/webmate-environment';
export * from './src/webmate-auth-info';

export function startSession(emailAddress: string, apiKey: string, baseUri?: string): WebmateAPISession {
    let env = new WebmateEnvironment(baseUri);
    let auth = new WebmateAuthInfo(emailAddress, apiKey);
    return new WebmateAPISession(auth, env);
}
