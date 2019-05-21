import * as express from "express";
import { Metadata } from "../core/MetadataCollector";
import { AppHelpers } from "../types";
interface RouterInterface {
    receiveMetadata(instance: object, data: Metadata[]): any;
    integrate(app: express.Application, helpers: AppHelpers): any;
}
export default RouterInterface;
