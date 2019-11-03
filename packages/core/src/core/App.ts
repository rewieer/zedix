import * as express from "express";
import chalk from "chalk";

import ControllerInterface from "../interface/ControllerInterface";
import RouterInterface from "../interface/RouterInterface";

import MetadataCollector from "./MetadataCollector";
import RequestContext from "./RequestContext";
import MiddlewareInterface from "../interface/MiddlewareInterface";
import LoggerInterface from "../service/LoggerInterface";
import { AppHelpers } from "../types";
import ServiceInterface from "../interface/ServiceInterface";

export type ServiceClass<
  TAppConfig extends object = {},
  TConstructorConfig = any
> = {
  new (config: TConstructorConfig): ServiceInterface;
  $getConfiguration?(config?: TAppConfig): TConstructorConfig;
};

type AppConfigureConf<TConfig extends object = {}> = {
  config?: TConfig;
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
 */
class App<TConfig extends object = {}> {
  public server: express.Application;
  public services: Record<string, ServiceInterface> = {};
  public routers: RouterInterface[] = [];
  public logger: LoggerInterface;

  public url: string = null;

  private initialize() {
    let instance = this;

    this.server = express();
    this.server.use(function(req: any, res, next) {
      if (instance !== null) {
        instance.url = req.protocol + "://" + req.get("host");
      }

      res.locals.context = new RequestContext();
      next();
    });
  }

  /*
  App => Request / Response router
  Returns a response for a request
  It has a router queue in which various components pass
  App => Authorization Handler => Router
   */

  async configure(conf: AppConfigureConf<TConfig>) {
    this.services = {};
    this.routers = conf.routers.slice();
    this.logger = conf.logger;
    this.initialize();

    const config = conf.config || {};

    // Create helpers so that services / middlewares can access App's public internals
    const helpers: AppHelpers = {
      getURL: () => {
        return this.url;
      },
      getLogger: () => {
        return this.logger;
      }
    };

    // - Step 1 : load services and configure them
    for (let service of conf.services) {
      let serviceConf = service.$getConfiguration
        ? service.$getConfiguration(config)
        : config;

      // @ts-ignore
      const instance = new service(serviceConf);
      if (this.services[instance.$getName()]) {
        throw new Error(
          "A service with name " + instance.$getName() + " already exists."
        );
      }

      this.services[instance.$getName()] = instance;
    }

    let curService: ServiceInterface;
    for (let name of Object.keys(this.services)) {
      curService = this.services[name];
      if (typeof curService.$initialize === "function") {
        await curService.$initialize();
      }
      if (typeof curService.$integrate === "function") {
        curService.$integrate(this.server);
      }
    }

    // - Step 2 : configure middlewares
    conf.middlewares.forEach(mdw => {
      this.server.use((req, res, next) => {
        mdw.handle(req, res.locals.context, next);
      });
    });

    // - Step 3 : collect controllers metadata and configure them
    conf.controllers.forEach(obj => {
      const metadata = MetadataCollector.getMetadataForObject(obj);
      conf.routers.forEach(router => router.$receiveMetadata(obj, metadata));
    });

    // - Step 4 : integrate routers with Express
    conf.routers.forEach(router => {
      router.$integrate(this.server, helpers);
    });

    return this;
  }

  getService(name: string) {
    return this.services[name];
  }

  getRouter(atIndex: number) {
    return this.routers[atIndex];
  }

  run(port: number) {
    this.server.listen(port, () => {
      console.log(
        chalk.bold.yellowBright("Z> Server is running on port " + port)
      );
    });
  }
}

export const AppClass = App;
export default new App();
