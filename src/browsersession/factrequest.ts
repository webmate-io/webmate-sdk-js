/**
 * A type of fact, either an artifact or a finding.
 *
 * Examples:
 * - { artifactType: "Page.ContentAnalysis" }
 * - { findingType: "LayoutComparison.IncorrectDimensions" }
 */
export type FactType =
    | { artifactType: string }
    | { findingType: string };

/**
 * A request for a fact, i.e. an artifact or a finding.
 */
export class FactRequest {
    constructor(public readonly factType: FactType, public readonly params?: any) {}

    asJson(): any {
        const json: any = {
            'factType': this.factType
        };
        if (this.params) {
            json['params'] = this.params;
        }
        return json;
    }
}
