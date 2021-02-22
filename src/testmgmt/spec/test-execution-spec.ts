import {TestType} from "../testtypes/test-type";
import {Tag} from "../../tag";
import {ApplicationModelId, TestSessionId, TestTemplateId} from "../../types";
import {SingleTestRunCreationSpec} from "../test-mgmt-client";

export abstract class TestExecutionSpec {

    protected constructor(protected readonly executionName: string,
                          protected readonly testType: TestType,
                          protected readonly defaultTestTemplateName: string,
                          protected readonly tags: Tag[],
                          protected readonly models: ApplicationModelId[],
                          protected readonly associatedTestSessions: TestSessionId[],
                          protected testTemplateId?: TestTemplateId) {}

    abstract makeTestRunCreationSpec(): SingleTestRunCreationSpec;

    asJson(): any {
        // If testTemplateId is set, then use it. Otherwise use the defaultTestTemplateName.
        let testTemplateIdOrName: any = {};
        if (!!this.testTemplateId) {
            testTemplateIdOrName["id"] = this.testTemplateId;
        } else {
            testTemplateIdOrName["name"] = this.defaultTestTemplateName;
        }

        // TODO check json serialization
        return {
            'executionName': this.executionName,
            'testTemplateIdOrName': testTemplateIdOrName,
            'tags': this.tags,
            'models': this.models,
            'associatedSessions': this.associatedTestSessions,
            'testRunCreationSpec': this.makeTestRunCreationSpec()
        }
    }

}
