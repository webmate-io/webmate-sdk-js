import 'mocha';
import {should, assert} from 'chai';
import {ExpeditionSpecFactory} from "../../src/browsersession/expedition-spec-factory";
import {Browser} from "../../src/browser";
import {BrowserType} from "../../src/browser-type";
import {Platform} from "../../src/platform";
import {PlatformType} from "../../src/platform-type";
should();

describe('Expedition Spec Tests', function() {

    let refExpeditionSpec = {
        "type" : "LiveExpeditionSpec",
        "driverSpec" : {
            "type" : "URLListDriverSpecification",
            "urls" : [ "http://test", "http://test2" ]
        },
        "vehicleSpec" : {
            "type" : "BrowserSpecification",
            "browser" : {
                "browserType" : "CHROME",
                "version" : "83",
                "platform" : {
                    "platformType" : "WINDOWS",
                    "platformVersion" : "10",
                    "platformArchitecture" : "64"
                }
            },
            "useProxy" : false
        }
    };

    it('should serialize the expedition spec correctly', function() {
        let expeditionSpec = ExpeditionSpecFactory.makeUrlListExpeditionSpec(
            ["http://test", "http://test2"],
            new Browser(BrowserType.CHROME, "83", new Platform(PlatformType.WINDOWS, "10", "64")));

        assert.equal(JSON.stringify(expeditionSpec.asJson()), JSON.stringify(refExpeditionSpec));
    });
});
