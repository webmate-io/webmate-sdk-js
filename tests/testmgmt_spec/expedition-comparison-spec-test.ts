import 'mocha';
import {should, assert} from 'chai';
import {ExpeditionSpecFactory} from "../../src/browsersession/expedition-spec-factory";
import {Browser} from "../../src/browser";
import {BrowserType} from "../../src/browser-type";
import {startSession} from "../../index";
import {ExpeditionComparisonCheckBuilder} from "../../src/testmgmt/spec/expedition-comparison-spec";
import {TestExecutionSpec} from "../../src/testmgmt/spec/test-execution-spec";
import {StandardTestTypes} from "../../src/testmgmt/testtypes/standard-test-types";
import {JsonSerializableArray} from "../../src/json-serializable-array";
should();

describe('Expedition Comparison Spec Tests', function() {

    let refExpeditionSpec = {
        "type": "SingleTestRunCreationSpec",
        "assignmentSpec": {
            "referenceExpeditionSpec": {
                "type": "ExpeditionSpec",
                "data": {
                    "type": "LiveExpeditionSpec",
                    "driverSpec": {
                        "type": "URLListDriverSpecification",
                        "urls": [
                            "http://bla"
                        ]
                    },
                    "vehicleSpec": {
                        "type": "BrowserSpecification",
                        "browser": {
                            "browserType": "CHROME",
                            "version": "83",
                            "platform": {
                                "platformType": "WINDOWS",
                                "platformVersion": "10",
                                "platformArchitecture": "64"
                            }
                        },
                        "useProxy": false
                    }
                }
            },
            "comparisonExpeditionSpecs": {
                "type": "List[ExpeditionSpec]",
                "data": [
                    {
                        "type": "ExpeditionSpec",
                        "data": {
                            "type": "LiveExpeditionSpec",
                            "driverSpec": {
                                "type": "URLListDriverSpecification",
                                "urls": [
                                    "http://bla"
                                ]
                            },
                            "vehicleSpec": {
                                "type": "BrowserSpecification",
                                "browser": {
                                    "browserType": "CHROME",
                                    "version": "83",
                                    "platform": {
                                        "platformType": "WINDOWS",
                                        "platformVersion": "10",
                                        "platformArchitecture": "64"
                                    }
                                },
                                "useProxy": false
                            }
                        }
                    }
                ]
            }
        }
    };

    function makeTestSpec(): TestExecutionSpec {
        let session = startSession("email", "apikey", "http://localhost");

        return ExpeditionComparisonCheckBuilder.builder(
            "test name",
            ExpeditionSpecFactory.makeUrlListExpeditionSpec(
                ["http://bla"],
                new Browser(BrowserType.CHROME, "83", undefined, "WINDOWS_10_64")),
            new JsonSerializableArray(ExpeditionSpecFactory.makeUrlListExpeditionSpec(
                ["http://bla"],
                new Browser(BrowserType.CHROME, "83", undefined, "WINDOWS_10_64")))
        ).setApiSession(session).build();
    }

    it('should build the spec with the builder correctly', function() {
        let spec = makeTestSpec();
        assert.equal(spec.testType, StandardTestTypes.ExpeditionComparison.testType);
        assert.equal(spec.executionName, "test name");
        assert.isUndefined(spec.testTemplateId);
        assert.lengthOf(spec.associatedTestSessions, 0);
        assert.lengthOf(spec.tags, 0);
        assert.lengthOf(spec.models, 0);
    });

    it('should serialize the expedition comparison spec correctly', function() {
        let spec = makeTestSpec();

        assert.equal(JSON.stringify(spec.makeTestRunCreationSpec().asJson()), JSON.stringify(refExpeditionSpec));
    });

});
