import ControllerInterface from "../interface/ControllerInterface";
import RouterInterface from "../interface/RouterInterface";
import * as express from "express";
import MiddlewareInterface from "../interface/MiddlewareInterface";
import LoggerInterface from "../service/LoggerInterface";
import { StringMap } from "../../src/typings/types";
declare type AppConfigureConf = {
    config: object;
    logger: LoggerInterface;
    controllers: ControllerInterface[];
    routers: RouterInterface[];
    middlewares: MiddlewareInterface[];
    services: any[];
};
/**
 * @class App
 * Core class
 *
 * Service custom fields :
 * __smuid__  : ID of the service (unique identifier given by the app)
 * __smcfgr__ : configurator. If provided, the app calls it in order to instantiate the object.
 * __smtpl__  : used by the express middleware to differentiate raw object and view objects
 */
declare class App {
    app: express.Application;
    services: StringMap<any>;
    routers: StringMap<any>;
    logger: LoggerInterface;
    url: string;
    initialize(): void;
    configure(conf: AppConfigureConf): Promise<this>;
    getService(constructor: any): any;
    getRouter(at: number): any;
    run(port: number): void;
}
declare const _default: App;
export default _default;
