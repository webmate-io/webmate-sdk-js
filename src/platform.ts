import {PlatformType} from "./platform-type";

export class Platform {
    constructor(public readonly platformType: PlatformType,
                public readonly platformVersion?: string,
                public readonly platformArchitecture?: string) {
    }

    public toString(): string {
        const versionSuffix = this.platformVersion === undefined ? '' : `_${this.platformVersion}`;
        const architectureSuffix = this.platformArchitecture ? `_${this.platformArchitecture}` : '';
        return `${this.platformType}${versionSuffix}${architectureSuffix}`;
    }

    public static fromString(opaqueString: string): Platform {
        const match = opaqueString.match(/^([^_]+)(?:_([^_]+)(?:_([^_]+))?)?$/);
        if (!match) {
            throw new Error(`Invalid platform string [${opaqueString}]. Must look like <platformType>[_<version>[_<architecture>]].`);
        }
        const [, platformType, version, architecture] = match;
        return new Platform(platformType, version, architecture);
    }
}
