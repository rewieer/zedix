import * as express from "express";
import { Metadata } from "../core/MetadataCollector";
import { AppHelpers } from "../types";

interface RouterInterface {
  receiveMetadata(instance: object, data: Metadata[]);
  integrate(app: express.Application, helpers: AppHelpers);
}

export default RouterInterface;
