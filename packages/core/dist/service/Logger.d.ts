import * as winston from "winston";
import * as Transport from "winston-transport";
import LoggerInterface from "./LoggerInterface";
import BaseService from "./BaseService";
declare class Logger extends BaseService implements LoggerInterface {
    logger: winston.Logger;
    constructor(config: {
        env: string;
        path: string;
        level: string;
    });
    addTransport(transport: Transport): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    getName(): string;
}
export default Logger;
