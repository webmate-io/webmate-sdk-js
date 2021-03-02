import {Tag} from "../tag";
import {ApplicationModelId, TestSessionId} from "../types";
import {WebmateAPISession} from "../webmate-api-session";
import {TestExecutionSpec} from "./spec/test-execution-spec";

export abstract class TestExecutionSpecBuilder {

    protected readonly tags: Tag[] = [];
    protected readonly models: ApplicationModelId[] = [];
    protected readonly testSessionIds: TestSessionId[] = [];
    protected optSession: WebmateAPISession | undefined;

    /**
     * Add a Tag corresponding to the current date, e.g. "2020-11-10".
     */
    withCurrentDateAsTag(): TestExecutionSpecBuilder {
        let date = new Date();
        let tag = new Tag(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`);
        this.tags.push(tag);
        return this;
    }

    withTag(tag: Tag): TestExecutionSpecBuilder {
        this.tags.push(tag);
        return this;
    }

    /**
     * Add a Tag corresponding to the given string.
     */
    withTagName(tagName: string, value?: string): TestExecutionSpecBuilder {
        this.tags.push(new Tag(tagName, value));
        return this;
    }

    withModel(model: ApplicationModelId): TestExecutionSpecBuilder {
        this.models.push(model);
        return this;
    }

    inTestSession(sessionId: TestSessionId): TestExecutionSpecBuilder {
        this.testSessionIds.push(sessionId);
        return this;
    }

    setApiSession(session: WebmateAPISession): TestExecutionSpecBuilder {
        this.optSession = session;
        return this;
    }

    public abstract build(): TestExecutionSpec;

}
