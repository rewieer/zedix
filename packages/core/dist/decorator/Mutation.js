"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MetadataCollector_1 = require("../core/MetadataCollector");
/**
 * Represent a GraphQL mutation
 * @param name
 * @constructor
 */
function Mutation(name) {
    return function (target, method) {
        MetadataCollector_1.default.add({
            type: "mutation",
            target: target.constructor,
            methodName: method,
            name
        });
    };
}
exports.default = Mutation;
//# sourceMappingURL=Mutation.js.map