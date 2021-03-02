import {TestType} from "./testtypes/test-type";
import {ApplicationModelId} from "../types";
import {TestTemplateInfo} from "./test-template-info";
import {TestParameter} from "./test-parameter";

export class TestTemplate {
    constructor(public readonly info: TestTemplateInfo,
                public readonly testType: TestType,
                public readonly models: ApplicationModelId[],
                public readonly params: TestParameter) {}

    public static fromJson(json: any): TestTemplate {
        return new TestTemplate(json.info,
            json.testType,
            json.models,
            json.params);
    }
}
