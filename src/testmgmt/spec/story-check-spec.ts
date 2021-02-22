import {TestExecutionSpec} from "./test-execution-spec";
import {ApplicationModelId, BrowserSessionId, TestSessionId} from "../../types";
import {Tag} from "../../tag";
import {StandardTestTypes} from "../testtypes/standard-test-types";
import {SingleTestRunCreationSpec} from "../test-mgmt-client";
import {WMValueFactory} from "../../jobs/wm-value-factory";
import {Map} from "immutable";
import {TestExecutionSpecBuilder} from "../test-execution-spec-builder";

/**
 * A StoryCheckSpec is a test type that sits on an existing Expedition, e.g. a Selenium or Appium Session, and allows
 * adding test results or having an individual overall execution result. It can be used when your Expedition
 * is used for multiple tests, e.g. when you create a single driver in your test set up code and reuse that
 * driver in multiple tests, features, specs, etc.
 *
 * The {@code executionName} is the name that is shown in your reports. You can set it to whatever helps you
 * identifying or grouping the test execution later, such as the feature or method name.
 */
export class StoryCheckSpec extends TestExecutionSpec {

    constructor(executionName: string, tags: Tag[], models: ApplicationModelId[], testSessions: TestSessionId[],
                private readonly expeditionId: BrowserSessionId) {
        super(executionName, StandardTestTypes.StoryCheck.testType, "Default StoryCheck", tags,
            models, testSessions);
    }

    makeTestRunCreationSpec(): SingleTestRunCreationSpec {
        return new SingleTestRunCreationSpec(Map({
            "expeditionId": WMValueFactory.makeExpeditionId(this.expeditionId)
        }));
    }

}

export class StoryCheckBuilder extends TestExecutionSpecBuilder {

    private constructor(private readonly storyName: string) {
        super();
    }

    static builder(storyName: string): StoryCheckBuilder {
        return new StoryCheckBuilder(storyName);
    }

    build(): TestExecutionSpec {
        if (!this.optSession) {
            throw new Error("Session not available. This is an internal error.");
        }
        let session = this.optSession;
        let expeditions = session.getAssociatedExpeditions();
        if (expeditions.length != 1) {
            throw new Error("The webmate session must be associated with exactly one expedition. Currently there are " + expeditions.length + ".");
        }

        let allTestSessionsToAssociate = [...session.getAssociatedTestSessions(), ...this.testSessionIds];
        let allModels = [...session.getAssociatedModels(), ...this.models];
        let allTags = [...session.getAssociatedTags(), ...this.tags];

        return new StoryCheckSpec(this.storyName, allTags, allModels, allTestSessionsToAssociate, expeditions[0]);
    }

}
