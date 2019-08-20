import * as express from "express";
import * as glob from "glob";

import { mergeTypes } from "merge-graphql-schemas";
import { ApolloServer, Config } from "apollo-server-express";

import RouterInterface from "../interface/RouterInterface";
import { Metadata } from "../core/MetadataCollector";
import { GraphQLExtension } from "graphql-extensions";
import { GraphQLScalarType, print } from "graphql";
import { AppHelpers } from "../types";
import LoggerInterface from "../service/LoggerInterface";

class LogExtension<TContext = any> implements GraphQLExtension<TContext> {
  private startTime: number;
  private logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this.logger = logger;
  }

  requestDidStart(o) {
    this.startTime = new Date().getTime();
  }

  willSendResponse(options) {
    let elapsedTime = new Date().getTime() - this.startTime;
    let unit = "ms";
    if (elapsedTime > 1000) {
      elapsedTime /= 1000;
      unit = "s";
    }

    // In case we want to know the query that failed : const loggedQuery = options.queryString || print(options.parsedQuery);
    this.logger.info(`GraphQL Request ${elapsedTime}${unit} `);
    if (options.graphqlResponse.errors) {
      options.graphqlResponse.errors.forEach(err => {
        let path = err.path ? err.path.join(" / ") : "Unknown Path";
        let stack = err.stack;
        if (
          !stack &&
          err.extensions &&
          err.extensions.exception &&
          err.extensions.exception.stacktrace
        ) {
          stack = err.extensions.exception.stacktrace.join("\n");
        }
        if (!stack) {
          stack = err.message;
        }
        this.logger.error(path + " : " + stack);
      });
    }
  }
}

type RouterConfig = Config & {
  schemaPath: string;
  types?: { [key: string]: GraphQLScalarType };
};

class GraphQLRouter implements RouterInterface {
  private queries = [];
  private mutations = [];
  private fields = {};
  private typedefs = [];
  private server: ApolloServer;
  private config: RouterConfig;

  constructor(conf: RouterConfig) {
    // Automatically load the schemas in the path
    const files = glob.sync(conf.schemaPath + "/**/*.ts");
    for (let path of files) {
      const typedef = require(path).default;
      if (typedef && typeof typedef === "string" && typedef.length > 0)
        this.typedefs.push(require(path).default);
    }

    this.config = conf;
  }

  $receiveMetadata(instance: object, metadata: Metadata[]) {
    for (let data of metadata) {
      if (data.type === "query") {
        this.queries.push({
          ...data,
          instance
        });
      } else if (data.type === "mutation") {
        this.mutations.push({
          ...data,
          instance
        });
      } else if (data.type === "field") {
        if (!this.fields[data.entity]) {
          this.fields[data.entity] = {};
        }

        this.fields[data.entity][data.field] = {
          ...data,
          instance
        };
      }
    }
  }

  $integrate(app: express.Application, helpers: AppHelpers) {
    const logExtensionFactory = () => new LogExtension(helpers.getLogger());
    const getAppFromContext = ({ res }) => {
      return res.locals.app;
    };

    const conf = this.config;

    if (conf.context) {
      console.warn(
        "Providing a context prop to the GraphQLRouter is not supported yet."
      );
    }

    // @ts-ignore
    conf.typeDefs = mergeTypes(this.typedefs, { all: true });
    conf.resolvers = this.buildResolvers();
    conf.extensions = conf.extensions
      ? [...conf.extensions, logExtensionFactory]
      : [logExtensionFactory];
    conf.context = getAppFromContext;

    this.server = new ApolloServer(conf);
    this.server.applyMiddleware({
      app
    });
  }

  private buildResolvers() {
    const queryHandlers = {};
    const mutationHandlers = {};

    this.queries.forEach(obj => {
      queryHandlers[obj.name] = (parent, args, context, info) => {
        return this.callInstance(
          obj.instance,
          obj.methodName,
          parent,
          args,
          context,
          info
        );
      };
    });

    this.mutations.forEach(obj => {
      mutationHandlers[obj.name] = (parent, args, context, info) => {
        return this.callInstance(
          obj.instance,
          obj.methodName,
          parent,
          args,
          context,
          info
        );
      };
    });

    let resolvers: any = {};
    if (this.queries.length > 0) {
      resolvers.Query = queryHandlers;
    }
    if (this.mutations.length > 0) {
      resolvers.Mutation = mutationHandlers;
    }

    const types = this.buildTypes();
    if (Object.keys(types).length > 0) {
      resolvers = {
        ...resolvers,
        ...types
      };
    }

    return resolvers;
  }

  /**
   * Build the list of types, which correspond to the different fields
   */
  private buildTypes() {
    const types = {};

    Object.keys(this.fields).forEach(key => {
      const data = this.fields[key];

      if (!types[key]) {
        types[key] = {};
      }

      Object.keys(data).forEach(fieldName => {
        const data = this.fields[key][fieldName];
        types[key][fieldName] = (entity, args, context, info) => {
          return this.callFieldResolver(
            data.instance,
            data.methodName,
            entity,
            args,
            context,
            info
          );
        };
      });
    });

    return {
      ...types,
      ...this.config.types
    };
  }

  private callInstance(instance, method, parent, args, context, info) {
    return instance[method](args, context, info, parent);
  }

  private callFieldResolver(instance, method, entity, args, context, info) {
    return instance[method](entity, args, context, info);
  }
}

export default GraphQLRouter;
