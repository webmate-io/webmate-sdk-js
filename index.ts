import {WebmateAPISession} from "./src/webmate-api-session";
import {WebmateEnvironment} from "./src/webmate-environment";
import {WebmateAuthInfo} from "./src/webmate-auth-info";
import {ProjectId} from "./src/types";

// Add entries in lexical order!

// root
export * from './src/browser';
export * from './src/browser-type';
export * from './src/platform';
export * from './src/platform-type';
export * from './src/tag';
export * from './src/types';
export * from './src/webmate-api-session';
export * from './src/webmate-auth-info';
export * from './src/webmate-capability-type';
export * from './src/webmate-environment';
// artifacts
export * from './src/artifacts/artifact-client';
export * from './src/artifacts/artifact-types';
// blobs
export * from './src/blobs/blob-client';
// browsersession
export * from './src/browsersession/browser-session-client';
export * from './src/browsersession/browser-session-ref';
export * from './src/browsersession/browser-session-screenshot-extraction-config';
export * from './src/browsersession/browser-session-state-extraction-config';
export * from './src/browsersession/browser-session-warm-up-config';
export * from './src/browsersession/browser-specification';
export * from './src/browsersession/driver-specification';
export * from './src/browsersession/expedition-spec';
export * from './src/browsersession/expedition-spec-factory';
export * from './src/browsersession/finish-story-action-add-artifact-data';
export * from './src/browsersession/live-expedition-spec';
export * from './src/browsersession/start-story-action-add-artifact-data';
export * from './src/browsersession/url-list-driver-specification';
export * from './src/browsersession/vehicle-specification';
// commonutils
export * from './src/commonutils/Dimension';
// device
export * from './src/device/device-client';
export * from './src/device/device-dto';
export * from './src/device/device-properties';
export * from './src/device/device-request';
// jobs
export * from './src/jobs/jobconfigs/crossbrowser-job-input';
export * from './src/jobs/jobconfigs/regression-job-input';
export * from './src/jobs/job-engine';
export * from './src/jobs/job-run-summary';
export * from './src/jobs/well-known-job-input';
export * from './src/jobs/wm-data-type';
export * from './src/jobs/wm-value';
export * from './src/jobs/wm-value-factory';
// mailTest
export * from './src/mailTest/mail-test-client';
export * from './src/mailTest/mail-test-types';
// packagemgmt
export * from './src/packagemgmt/image-type';
export * from './src/packagemgmt/package';
export * from './src/packagemgmt/packagemgmt-client';
// selenium
export * from './src/selenium/selenium-capability';
export * from './src/selenium/selenium-service-client';
export * from './src/selenium/selenium-session';
export * from './src/selenium/selenium-session-proxy';
export * from './src/selenium/webmate-selenium-session';
export * from './src/selenium/webmate-selenium-session';
// testmgmt
export * from './src/testmgmt/spec/expedition-comparison-spec';
export * from './src/testmgmt/spec/story-check-spec';
export * from './src/testmgmt/spec/test-execution-spec';
export * from './src/testmgmt/testtypes/standard-test-types';
export * from './src/testmgmt/testtypes/test-type';
export * from './src/testmgmt/create-test-execution-response';
export * from './src/testmgmt/test';
export * from './src/testmgmt/test-execution-evaluation-status';
export * from './src/testmgmt/test-execution-execution-status';
export * from './src/testmgmt/test-execution-spec-builder';
export * from './src/testmgmt/test-execution-summary';
export * from './src/testmgmt/test-info';
export * from './src/testmgmt/test-mgmt-client';
export * from './src/testmgmt/test-parameter';
export * from './src/testmgmt/test-result';
export * from './src/testmgmt/test-run';
export * from './src/testmgmt/test-run-evaluation-status';
export * from './src/testmgmt/test-run-execution-status';
export * from './src/testmgmt/test-run-finish-data';
export * from './src/testmgmt/test-run-info';
export * from './src/testmgmt/test-run-summary';
export * from './src/testmgmt/test-session';
export * from './src/testmgmt/test-template';
export * from './src/testmgmt/test-template-info';

export function startSession(emailAddress: string, apiKey: string, baseUri?: string, projectId?: ProjectId): WebmateAPISession {
    let env = new WebmateEnvironment(baseUri);
    let auth = new WebmateAuthInfo(emailAddress, apiKey);
    return new WebmateAPISession(auth, env, projectId);
}
