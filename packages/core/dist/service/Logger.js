"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const BaseService_1 = require("./BaseService");
const MB = (val) => val * 1000000; // Return val in Megabyte
const createFileConfig = (filename, level = "info") => ({
    filename,
    level,
    maxFiles: 5,
    maxsize: MB(10)
});
class Logger extends BaseService_1.default {
    constructor(config) {
        super();
        if (typeof config.path !== "string") {
            throw new Error("The path must be a valid path");
        }
        const env = config.env;
        this.logger = winston.createLogger({
            level: config.level,
            format: winston.format.combine(winston.format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }), winston.format.json()),
            transports: [
                new winston.transports.File(createFileConfig(config.path + `/${env}.log`)),
                new winston.transports.File(createFileConfig(config.path + `/${env}.error.log`, "error")),
                ...(config.env === "prod"
                    ? []
                    : [
                        new winston.transports.Console({
                            format: winston.format.combine(winston.format.cli(), winston.format.align())
                        })
                    ])
            ]
        });
    }
    addTransport(transport) {
        this.logger.add(transport);
    }
    info(message) {
        this.logger.info(message);
    }
    warn(message) {
        this.logger.warning(message);
    }
    error(message) {
        this.logger.error(message);
    }
    getName() {
        return "Logger";
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map