"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ejs = require("ejs");
const BaseService_1 = require("./BaseService");
class Templating extends BaseService_1.default {
    constructor(config) {
        super();
        this.viewsPath = path.resolve(config.paths.views);
    }
    integrate(app) {
        app.set("view engine", "ejs");
    }
    parse(filename, data) {
        return ejs.renderFile(path.resolve(this.viewsPath, filename), data);
    }
    getName() {
        return "Templating";
    }
}
exports.default = Templating;
//# sourceMappingURL=Templating.js.map