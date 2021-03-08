import {ImageId} from "../types";
import {JsonSerializable} from "../json-serializable";

export class ImagePool implements JsonSerializable {

    private readonly imageIds: Set<ImageId>;

    constructor(imageId: ImageId) {
        this.imageIds = new Set<ImageId>();
        this.imageIds.add(imageId);
    }

    getImageIds(): Set<ImageId> {
        return this.imageIds;
    }

    contains(imageId: ImageId): boolean {
        return this.imageIds.has(imageId);
    }

    asJson(): any {
        return {
            "imagePool": this.imageIds
        };
    }

}
