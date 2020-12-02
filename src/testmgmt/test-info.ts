import {DateTime} from "../types";
import {TestId} from "./testmgmt-types";

export interface TestInfo {
    id: TestId,
    name: string,
    creationTime: DateTime,
    description: string,
    version: number
}
