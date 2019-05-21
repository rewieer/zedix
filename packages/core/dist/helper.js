"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurable = (klass, configure) => {
    klass.__zxcfgr__ = configure;
    return klass;
};
//# sourceMappingURL=helper.js.map