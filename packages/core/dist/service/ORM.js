"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const BaseService_1 = require("./BaseService");
class ORM extends BaseService_1.default {
    constructor(config) {
        super();
        this.options = Object.assign({}, config.orm, { type: config.parameters.DATABASE_TYPE, host: config.parameters.DATABASE_HOST, port: config.parameters.DATABASE_PORT, username: config.parameters.DATABASE_USERNAME, password: config.parameters.DATABASE_PASSWORD, database: config.parameters.DATABASE_NAME });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield typeorm_1.createConnection(this.options);
        });
    }
    getRepository(type) {
        return this.connection.getRepository(type);
    }
    getName() {
        return "ORM";
    }
}
exports.default = ORM;
//# sourceMappingURL=ORM.js.map