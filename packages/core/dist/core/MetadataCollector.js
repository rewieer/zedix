"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class MetadataCollector
 * Gather metadata about various objects
 * Typically used with directives
 */
class MetadataCollector {
    constructor() {
        this.metadata = [];
    }
    add(data) {
        this.metadata.push(data);
    }
    getMetadataForObject(object) {
        return this.metadata.filter(data => data.target === object.constructor);
    }
    clear() {
        this.metadata = [];
    }
}
exports.default = new MetadataCollector();
//# sourceMappingURL=MetadataCollector.js.map