import {TestType} from "../testtypes/test-type";
import {Tag} from "../../tag";
import {ApplicationModelId, TestSessionId, TestTemplateId} from "../../types";
import {SingleTestRunCreationSpec} from "../test-mgmt-client";

export abstract class TestExecutionSpec {

    protected constructor(public readonly executionName: string,
                          public readonly testType: TestType,
                          public readonly defaultTestTemplateName: string,
                          public readonly tags: Tag[],
                          public readonly models: ApplicationModelId[],
                          public readonly associatedTestSessions: TestSessionId[],
                          public testTemplateId?: TestTemplateId) {}

    abstract makeTestRunCreationSpec(): SingleTestRunCreationSpec;

    asJson(): any {
        // If testTemplateId is set, then use it. Otherwise use the defaultTestTemplateName.
        let testTemplateIdOrName: any = {};
        if (!!this.testTemplateId) {
            testTemplateIdOrName["id"] = this.testTemplateId;
        } else {
            testTemplateIdOrName["name"] = this.defaultTestTemplateName;
        }

        return {
            'executionName': this.executionName,
            'testTemplateIdOrName': testTemplateIdOrName,
            'tags': this.tags,
            'models': this.models,
            'associatedSessions': this.associatedTestSessions,
            'testRunCreationSpec': this.makeTestRunCreationSpec().asJson()
        };
    }

}
