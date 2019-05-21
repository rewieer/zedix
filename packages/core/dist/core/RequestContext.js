"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class RequestContext
 * represent the context of an HTTP request
 */
class RequestContext {
    constructor() {
        this.data = {};
    }
    set(name, value) {
        this.data[name] = value;
    }
    get(name) {
        return this.data[name];
    }
    has(name) {
        return this.data[name] !== undefined;
    }
}
exports.default = RequestContext;
//# sourceMappingURL=RequestContext.js.map