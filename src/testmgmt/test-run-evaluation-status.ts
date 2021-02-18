/**
 * The evaluation status of a TestRun represents the result of a TestRun, i.e. if
 * errors have been found or not. During a TestRun, the verdict may still be pending.
 */
export enum TestRunEvaluationStatus {
    UNKNOWN = 'unknown',
    FAILED = 'failed',
    PASSED = 'passed',
    PENDING_PASSED = 'pending_passed',
    PENDING_FAILED = 'pending_failed',
    SKIPPED = 'skipped',
}
