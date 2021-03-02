import {ExpeditionSpec} from "./expedition-spec";
import {DriverSpecification} from "./driver-specification";
import {VehicleSpecification} from "./vehicle-specification";

/**
 * A specification of an expedition that may still be executed. The expedition uses a
 * Vehicle, e.g. a Browser or mobile App, and is controlled by a Driver, e.g. a URL list,
 * a Selenium script, or a user in an interactive session.
 */
export class LiveExpeditionSpec implements ExpeditionSpec {
    constructor(public readonly driverSpec: DriverSpecification,
                public readonly vehicleSpec: VehicleSpecification) {}

    asJson(): any {
        return {
            'type': 'LiveExpeditionSpec',
            'driverSpec': this.driverSpec.asJson(),
            'vehicleSpec': this.vehicleSpec.asJson()
        };
    }
}
