import {TestSessionId} from "../types";
import {WebmateAPISession} from "../webmate-api-session";

/**
 * Facade for a (running or finished) TestSession
 */
export class TestSession {
    constructor(public readonly id: TestSessionId, public readonly session: WebmateAPISession) {}
}
