import {DateTime, TestTemplateId} from "../types";

export class TestTemplateInfo {
    constructor(public readonly testId: TestTemplateId,
                public readonly name: string,
                public creationTime: DateTime,
                public description: string,
                public version: number,
                public isBaseTemplate: boolean) {
    }
}
