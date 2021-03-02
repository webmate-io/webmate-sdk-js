import {TestExecutionSpec} from "./test-execution-spec";
import {ExpeditionSpec} from "../../browsersession/expedition-spec";
import {TestExecutionSpecBuilder} from "../test-execution-spec-builder";
import {ApplicationModelId, TestSessionId} from "../../types";
import {Tag} from "../../tag";
import {StandardTestTypes} from "../testtypes/standard-test-types";
import {SingleTestRunCreationSpec} from "../test-mgmt-client";
import {WMValueFactory} from "../../jobs/wm-value-factory";
import {Map} from "immutable";
import {JsonSerializableArray} from "../../json-serializable-array";

export class ExpeditionComparisonSpec extends TestExecutionSpec {

    private readonly referenceSpec: ExpeditionSpec;
    private readonly compareSpecs: JsonSerializableArray<ExpeditionSpec>;

    constructor(executionName: string, tags: Tag[], models: ApplicationModelId[], testSessions: TestSessionId[],
                        referenceSpec: ExpeditionSpec, compareSpecs: JsonSerializableArray<ExpeditionSpec>) {
        super(executionName, StandardTestTypes.ExpeditionComparison.testType, "Default Expedition Comparison Test", tags, models, testSessions);
        this.referenceSpec = referenceSpec;
        this.compareSpecs = compareSpecs;
    }

    makeTestRunCreationSpec(): SingleTestRunCreationSpec {
        return new SingleTestRunCreationSpec(Map({
            "referenceExpeditionSpec": WMValueFactory.makeExpeditionSpec(this.referenceSpec),
            "comparisonExpeditionSpecs": WMValueFactory.makeExpeditionSpecList(this.compareSpecs)
        }));
    }

}

/**
 * Builder that can/should be used for creating the specification.
 */
export class ExpeditionComparisonCheckBuilder extends TestExecutionSpecBuilder {

    private constructor(private readonly executionName: string, private readonly referenceSpec: ExpeditionSpec,
                        private readonly compareSpecs: JsonSerializableArray<ExpeditionSpec>) {
        super();
    }

    static builder(executionName: string, referenceSpec: ExpeditionSpec, compareSpec: Array<ExpeditionSpec>): ExpeditionComparisonCheckBuilder {
        return new ExpeditionComparisonCheckBuilder(executionName, referenceSpec, new JsonSerializableArray(...compareSpec));
    }

    build(): TestExecutionSpec {
        if (!this.optSession) {
            throw new Error("Session not available. This is an internal error.");
        }
        let session = this.optSession;
        let allTestSessionsToAssociate = [...session.getAssociatedTestSessions(), ...this.testSessionIds];
        let allModels = [...session.getAssociatedModels(), ...this.models];
        let allTags = [...session.getAssociatedTags(), ...this.tags];

        return new ExpeditionComparisonSpec(this.executionName, allTags, allModels, allTestSessionsToAssociate,
            this.referenceSpec, this.compareSpecs);
    }

}
