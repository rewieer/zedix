"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MetadataCollector_1 = require("../core/MetadataCollector");
/**
 * Represent a GraphQL Query
 * @param entity
 * @param field
 * @constructor
 */
function Field(entity, field) {
    return function (target, method) {
        MetadataCollector_1.default.add({
            type: "field",
            target: target.constructor,
            methodName: method,
            entity,
            field
        });
    };
}
exports.default = Field;
//# sourceMappingURL=Field.js.map