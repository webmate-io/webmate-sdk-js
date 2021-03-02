import {DriverSpecification} from "./driver-specification";

/**
 * An expedition driver that makes the vehicle, i.e. probably a web browser in this case, visit
 * a list of URLs.
 */
export class URLListDriverSpecification implements DriverSpecification {
    constructor(public readonly urls: string[]) {}

    asJson(): any {
        return {
            'type': 'URLListDriverSpecification',
            'urls': this.urls
        };
    }
}
