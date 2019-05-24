import * as express from "express";
import * as bodyParser from "body-parser";
import chalk from "chalk";

import ControllerInterface from "../interface/ControllerInterface";
import RouterInterface from "../interface/RouterInterface";

import MetadataCollector from "./MetadataCollector";
import RequestContext from "./RequestContext";
import MiddlewareInterface from "../interface/MiddlewareInterface";
import LoggerInterface from "../service/LoggerInterface";
import { AppHelpers, StringMap } from "../types";
import ServiceInterface from "../interface/ServiceInterface";

type ServiceClass = {
  new (...args: any[]): ServiceInterface;
  __zxcfgr__: (config: object) => any;
};

type AppConfigureConf = {
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
class App {
  public app: express.Application;
  public services: StringMap<any> = {};
  public routers: StringMap<any> = {};
  public logger: LoggerInterface;

  public url: string = null;

  initialize() {
    let _that = this;

    this.app = express();
    this.app.use(bodyParser.json({ limit: "10mb" }));
    this.app.use(function(req: any, res, next) {
      if (_that !== null) {
        _that.url = req.protocol + "://" + req.get("host");
        _that = null; // clear ref for G.C
      }

      res.locals.app = new RequestContext();
      next();
    });
  }

  /*
  App => Request / Response router
  Returns a response for a request
  It has a router queue in which various components pass
  App => Authorization Handler => Router
   */

  async configure(conf: AppConfigureConf) {
    this.services = {};
    this.routers = conf.routers.slice();
    this.logger = conf.logger;
    this.initialize();

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
      let serviceConf = service.__zxcfgr__
        ? service.__zxcfgr__(conf.config)
        : [conf.config];

      const instance = new service(...serviceConf);
      if (this.services[instance.getName()]) {
        throw new Error(
          "A service with name " + instance.getName() + " already exists."
        );
      }

      this.services[instance.getName()] = instance;
    }

    let curService;
    for (let name of Object.keys(this.services)) {
      curService = this.services[name];
      if (typeof curService.initialize === "function") {
        await curService.initialize();
      }
      if (typeof curService.integrate === "function") {
        curService.integrate(this.app);
      }
    }

    // - Step 2 : configure middlewares
    conf.middlewares.forEach(mdw => {
      this.app.use((req, res, next) => {
        mdw.handle(req, res.locals.app, next);
      });
    });

    // - Step 3 : configure controllers
    conf.controllers.forEach(obj => {
      const metadata = MetadataCollector.getMetadataForObject(obj);
      conf.routers.forEach(router => router.receiveMetadata(obj, metadata));
    });

    // - Step 4 : integrate routers with Express
    conf.routers.forEach(router => {
      router.integrate(this.app, helpers);
    });

    return this;
  }

  getService(name: string) {
    return this.services[name];
  }

  getRouter(at: number) {
    return this.routers[at];
  }

  run(port: number) {
    this.app.listen(port, () => {
      console.log(
        chalk.bold.yellowBright("Z> Server is running on port " + port)
      );
    });
  }
}

export default new App();
