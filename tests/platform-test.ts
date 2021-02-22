import 'mocha';
import {should, assert, expect} from 'chai';
import {Platform} from "../src/platform";
should();

describe('Platform Tests', function() {
    it('should parse the platform strings correctly', function() {
        let platform_win_10_64 = Platform.fromString('WINDOWS_10_64');
        platform_win_10_64.platformType.should.eq('WINDOWS');
        platform_win_10_64.platformVersion.should.eq('10');
        platform_win_10_64.platformArchitecture!.should.eq('64');

        let platform_win_10 = Platform.fromString('WINDOWS_10');
        platform_win_10.platformType.should.eq('WINDOWS');
        platform_win_10.platformVersion.should.eq('10');
        assert.isUndefined(platform_win_10.platformArchitecture, 'Platform architecture must be undefined');
    });

    it('should throw an error for invalid platform strings', function() {
        expect(() => Platform.fromString('WINDOWS')).to.throw();
        expect(() => Platform.fromString('WINDOWS10')).to.throw();
    });

    it('should correctly transform platform objects to strings', function() {
        let platform_win_10_64 = new Platform('WINDOWS', '10', '64');
        platform_win_10_64.toString().should.eq('WINDOWS_10_64');

        let platform_win_10 = new Platform('WINDOWS', '10');
        platform_win_10.toString().should.eq('WINDOWS_10');
    });
});
