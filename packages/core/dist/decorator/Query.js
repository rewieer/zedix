"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MetadataCollector_1 = require("../core/MetadataCollector");
/**
 * Represent a GraphQL Query
 * @param name
 * @constructor
 */
function Query(name) {
    return function (target, method) {
        MetadataCollector_1.default.add({
            type: "query",
            target: target.constructor,
            methodName: method,
            name
        });
    };
}
exports.default = Query;
//# sourceMappingURL=Query.js.map