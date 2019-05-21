import * as express from "express";
import ControllerInterface from "../interface/ControllerInterface";
import RouterInterface from "../interface/RouterInterface";
import MiddlewareInterface from "../interface/MiddlewareInterface";
import LoggerInterface from "../service/LoggerInterface";
import { StringMap } from "../types";
import ServiceInterface from "../interface/ServiceInterface";
declare type ServiceClass = {
    new (...args: any[]): ServiceInterface;
    __zxcfgr__: (config: object) => any;
};
declare type AppConfigureConf = {
    config: object;
    logger: LoggerInterface;
    controllers: ControllerInterface[];
    routers: RouterInterface[];
    middlewares: MiddlewareInterface[];
    services: ServiceClass[];
};
/**
 * @class App
 * Core class
 *
 * Service custom fields :
 * __zxcfgr__ : configurator. If provided, the app calls it in order to instantiate the object.
 */
declare class App {
    app: express.Application;
    services: StringMap<any>;
    routers: StringMap<any>;
    logger: LoggerInterface;
    url: string;
    initialize(): void;
    configure(conf: AppConfigureConf): Promise<this>;
    getService(name: string): any;
    getRouter(at: number): any;
    run(port: number): void;
}
declare const _default: App;
export default _default;
