import * as express from "express";
import * as onFinished from "on-finished";
import * as cors from "cors";
import chalk from "chalk";

import RouterInterface from "../interface/RouterInterface";
import { Metadata } from "../core/MetadataCollector";
import { AppHelpers, StringMap } from "../types";
import LoggerInterface from "../service/LoggerInterface";

const argRegex = /:(\w*)/g;

type Route = {
  target: object;
  targetMethodName: string;
  path: string;
  method: string;
  params: any[] | null;
};

type Config = {
  spa?: string;
  views: string;
  public: string;
};

type RouterMetadata = Metadata & { name?: string };

class ExpressRouter implements RouterInterface {
  private routes: StringMap<Route> = {};
  private config: Partial<Config>;
  private helpers: AppHelpers;

  constructor(config?: Config) {
    this.config = config || {};
  }

  receiveMetadata(instance: object, data: RouterMetadata[]) {
    for (let metadata of data) {
      if (metadata.type === "web") {
        let params = null;
        const method = metadata.method.toLowerCase();
        if (method === "get") {
          const matches = metadata.path.match(argRegex);
          if (matches) {
            params = matches.map(str => str.substr(1));
          }
        }

        this.routes[metadata.name] = {
          target: instance,
          targetMethodName: metadata.methodName,
          path: metadata.path,
          method,
          params
        };
      }
    }
  }

  integrate(app: express.Application, helpers: AppHelpers) {
    this.helpers = helpers;

    if (this.config.views) {
      app.set("views", this.config.views);
    }

    if (this.config.public) {
      app.use(express.static(this.config.public));
    }

    app.use(cors());

    Object.keys(this.routes).forEach(key => {
      const route = this.routes[key];
      if (route.path.startsWith("/") === false) {
        console.warn(
          `Paths must start with a /. Check the route for ${route.path}`
        );
      }

      app[route.method](route.path, async (req, res) => {
        let params = [];
        if (route.method === "get" && route.params) {
          params = route.params.map(name => req.params[name]);
        }

        if (route.method !== "get") {
          params.push(req.body);
        } else {
          params.push(req.query);
        }

        params.push(req);
        params.push(res);

        logRequest(this.helpers.getLogger(), req, res);
        const result = await route.target[route.targetMethodName](...params);
        if (result) {
          // Currently we allow to render templates by returning a custom object
          // containing key __zxtpl__.
          // TODO : provide parameters into the Web MetaData to determine wether it's
          // returning an object or a rendering path
          if (result.__zxtpl__) {
            res.render(result.name, result.params);
            return;
          }

          res.send(result);
        }
      });
    });

    if (this.config && this.config.spa) {
      app.use("*", (req, res) => {
        res.sendFile(this.config.spa);
      });
    }
  }

  generateURL(name: string, params?: object) {
    params = params || {};

    const route = this.routes[name];
    if (!route) {
      throw new Error("Cannot find route with name " + name);
    }

    const out =
      this.helpers.getURL() +
      Object.keys(params).reduce((accUrl, key) => {
        return accUrl.replace(":" + key, params[key]);
      }, route.path);

    return out;
  }
}

function logRequest(logger: LoggerInterface, req, res) {
  // @ts-ignore
  res._startTime = new Date();
  onFinished(res, (err, res) => {
    let elapsedTime = Math.round(
      new Date().getTime() - res._startTime.getTime()
    );
    let unit = "ms";
    if (elapsedTime > 1000) {
      elapsedTime /= 1000;
      unit = "s";
    }

    let statusCode = res.statusCode;
    if (statusCode < 400) {
      statusCode = chalk.greenBright.bold(statusCode);
    } else if (statusCode < 500) {
      statusCode = chalk.yellowBright.bold(statusCode);
    } else {
      statusCode = chalk.redBright.bold(statusCode);
    }

    logger.info(
      `${req.method.toUpperCase()} ${
        req.path
      } ${statusCode} ${elapsedTime}${unit} `
    );
  });
}

export default ExpressRouter;
