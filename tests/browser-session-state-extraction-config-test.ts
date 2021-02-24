import 'mocha';
import {should, assert} from 'chai';
import {BrowserSessionStateExtractionConfig} from "../src/browsersession/browser-session-state-extraction-config";
import {Dimension} from "../src/commonutils/Dimension";
import {BrowserSessionScreenshotExtractionConfig} from "../src/browsersession/browser-session-screenshot-extraction-config";
import {BrowserSessionWarmUpConfig} from "../src/browsersession/browser-session-warm-up-config";
should();

describe('Browser Session State Extraction Config Tests', function() {

    let refNonNull = {
        "stateId": "7dfaca76-9a99-4770-ad29-3731de31f241",
        "extractionDelay": 1,
        "extractionCooldown": 2,
        "optViewportDimension": {
            "width": 600,
            "height": 800
        },
        "maxAdditionWaitingTimeForStateExtraction": 5,
        "extractDomStateData": true,
        "screenShotConfig": {
            "fullPage": false,
            "hideFixedElements": false,
            "useTranslateYScrollStrategy": false
        },
        "warmUpConfig": {
            "pageWarmUpScrollBy": 42,
            "pageWarmUpScrollDelay": 2,
            "pageWarmUpMaxScrolls": 5458
        }
    };

    let refWarmUp = {
        "stateId": "7dfaca76-9a99-4770-ad29-3731de31f241",
        "extractionDelay": 1,
        "extractionCooldown": 2,
        "optViewportDimension": {
            "width": 600,
            "height": 800
        },
        "maxAdditionWaitingTimeForStateExtraction": 5,
        "extractDomStateData": true,
        "screenShotConfig": {
            "fullPage": false,
            "hideFixedElements": false,
            "useTranslateYScrollStrategy": false
        }
    };

    let refEmptyObj = {};


    it('Serialize correctly with non null fields', function() {
        let config = new BrowserSessionStateExtractionConfig("7dfaca76-9a99-4770-ad29-3731de31f241", 1,2,
            new Dimension(600,800),5,true, new BrowserSessionScreenshotExtractionConfig(false, false),
            new BrowserSessionWarmUpConfig(42,2,5458));

        assert.equal(JSON.stringify(config), JSON.stringify(refNonNull));
    });

    it('Serialize correctly with null fields', function() {
        let config = new BrowserSessionStateExtractionConfig("7dfaca76-9a99-4770-ad29-3731de31f241", 1,2,
            new Dimension(600,800),5,true, new BrowserSessionScreenshotExtractionConfig(false, false),
            undefined);

        assert.equal(JSON.stringify(config), JSON.stringify(refWarmUp));
    });

    it('Serialize correctly with all null fields', function() {
        let config = new BrowserSessionStateExtractionConfig();

        assert.equal(JSON.stringify(config), JSON.stringify(refEmptyObj));
    });

});
