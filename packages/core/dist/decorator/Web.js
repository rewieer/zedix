"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MetadataCollector_1 = require("../core/MetadataCollector");
/**
 * Represent a Web Query
 * @param params
 * @constructor
 */
function Web(params) {
    return function (target, method) {
        MetadataCollector_1.default.add({
            type: "web",
            target: target.constructor,
            methodName: method,
            name: params.name,
            path: params.path,
            method: params.method
        });
    };
}
exports.default = Web;
//# sourceMappingURL=Web.js.map