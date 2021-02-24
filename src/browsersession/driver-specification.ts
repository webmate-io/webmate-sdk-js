/**
 * Specification of an Expedition "Driver", i.e. logic that controls a "Vehicle", e.g. a Browser or an App,
 * in an expedition.
 *
 * Implementations must have 'type' as json attribute.
 */
export interface DriverSpecification {
    asJson(): any
}
