/**
 * Marker interface for "Expedition Vehicles", e.g. a Browser or a mobile App,
 * that are controlled in an expedition to perform tests. Vehicles are controlled by "Expedition Drivers", e.g.
 * URL lists, a Selenium script, or a crawler.
 *
 * Implementations must have 'type' as json attribute.
 */
export interface VehicleSpecification {
    asJson(): any
}
