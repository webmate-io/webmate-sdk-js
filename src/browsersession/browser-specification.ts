import {VehicleSpecification} from "./vehicle-specification";
import {Dimension} from "../commonutils/Dimension";
import {Browser} from "../browser";

/**
 * Specification of a Browser as an expedition vehicle. This may be used if you want to
 * create an Expedition where a Browser is controlled to perform a test.
 */
export class BrowserSpecification implements VehicleSpecification {

    public readonly useProxy: boolean = false;

    /**
     * @param browser Specification of the requested Browser, i.e. browser type, version etc.
     * @param viewportDimensions The browser's view port size.
     */
    constructor(public readonly browser: Browser, public readonly viewportDimensions?: Dimension) {}

    asJson(): any {
        let r: any = {
            'type': 'BrowserSpecification',
            'browser': this.browser,
            'useProxy': this.useProxy
        };

        if (!!this.viewportDimensions) {
            r['viewportDimensions'] = this.viewportDimensions;
        }

        return r;
    }
}
