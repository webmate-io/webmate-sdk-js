import 'mocha';
import {should, assert, expect} from 'chai';
import {Platform} from "../src/platform";
import {Browser} from "../src/browser";
import {BrowserType} from "../src/browser-type";
import {PlatformType} from "../src/platform-type";
should();

describe('Browser Tests', function() {
    it('should correctly construct and process the browser object', function() {
        let platform = new Platform(PlatformType.WINDOWS, '10', '64');
        let browsers = [
            new Browser(BrowserType.CHROME, "83", undefined,"WINDOWS_10_64"),
            new Browser(BrowserType.CHROME, "83", platform)
        ];

        browsers.forEach(browser => {
            browser.version.should.eq('83');
            assert.isUndefined(browser.properties, 'Platform architecture must be undefined');
            browser.platform.platformType.should.eq(PlatformType.WINDOWS);
            browser.platform.platformVersion.should.eq('10');
            browser.platform.platformArchitecture!.should.eq('64');
        })
    });
});
