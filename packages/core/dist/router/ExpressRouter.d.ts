import * as express from "express";
import RouterInterface from "../interface/RouterInterface";
import { Metadata } from "../core/MetadataCollector";
import { AppHelpers } from "../types";
declare type Config = {
    spa?: string;
    views: string;
    public: string;
};
declare type RouterMetadata = Metadata & {
    name?: string;
};
declare class ExpressRouter implements RouterInterface {
    private routes;
    private config;
    private helpers;
    constructor(config?: Config);
    receiveMetadata(instance: object, data: RouterMetadata[]): void;
    integrate(app: express.Application, helpers: AppHelpers): void;
    generateURL(name: string, params?: object): string;
}
export default ExpressRouter;
