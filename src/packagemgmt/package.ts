import {BlobId, DateTime, PackageId, ProjectId, UserId} from "../types";

export class Package {
    constructor(public id: PackageId,
                public projectId: ProjectId,
                public creator: UserId,
                public creationTime: DateTime,
                public name: string,
                public description: string,
                public versionComment: string,
                public index: number,
                public amountOfVersions: number,
                public origPackageId: PackageId,
                public origPackageType: string,
                public origBlobId: BlobId,
                public origMetaData: any,
                public origProperties: any,
                public instrumentedPackageId?: PackageId,
                public instrumentedPackageType?: string,
                public instrumentedBlobId?: BlobId) {
    }
}
