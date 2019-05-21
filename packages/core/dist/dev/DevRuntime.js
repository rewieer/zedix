"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class DevRuntime
 * Provide a development environment embedding
 * - automatic reloading of app
 * - asset bundling
 */
class DevRuntime {
    constructor(envs) {
        this.environments = [];
        this.environments = envs;
    }
    start() {
        this.environments.forEach(environment => environment.spawn());
    }
}
exports.default = DevRuntime;
//# sourceMappingURL=DevRuntime.js.map