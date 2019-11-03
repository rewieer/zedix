import * as express from "express";
import { Metadata } from "../core/MetadataCollector";
import { AppHelpers } from "../types";

/**
 * @interface RouterInterface
 * Represent a router. A router is a class who can provide routes given a configuration.
 */
interface RouterInterface {
  /**
   * Allow the implementation to receive all the metadata.
   * A metadata is an information registered about a specific class. They are
   * registered through decorators.
   * @param instance
   * @param data
   */
  $receiveMetadata(instance: object, data: Metadata[]);

  /**
   * Integrates the router into the application. It's the step where routes are created.
   * @param app
   * @param helpers
   */
  $integrate(app: express.Application, helpers: AppHelpers);
}

export default RouterInterface;
