import {PlatformType} from "./platform-type";

export class Platform {
    constructor(public readonly platformType: PlatformType,
                public readonly platformVersion: string,
                public readonly platformArchitecture?: string) {
    }

    public toString(): string {
        let suffix = !this.platformArchitecture ? '' : `_${this.platformArchitecture}`;
        return `${this.platformType}_${this.platformVersion}${suffix}`;
    }

    public static fromString(opaqueString: string) {
        let pattern = /^([^_]+)_([^_]+)(_([^_]+))?$/;
        let m = opaqueString.match(pattern);
        if (!!m && m.length == 5) {
            let platform = !m[3]
                ? new Platform(m[1], m[2])
                : new Platform(m[1], m[2] , m[3].replace('_', ''));
            return platform;
        } else {
            throw new Error(`Invalid platform string [${opaqueString}]. Must look like <platformType>_<version>[_<architecture>].`);
        }
    }
}
