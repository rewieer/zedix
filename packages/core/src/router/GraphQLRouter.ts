import * as express from "express";
import * as glob from "glob";

import { mergeTypes } from "merge-graphql-schemas";
import { ApolloServer, Config } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { GraphQLExtension } from "graphql-extensions";

import RouterInterface from "../interface/RouterInterface";
import { Metadata } from "../core/MetadataCollector";
import { AppHelpers } from "../types";
import LoggerInterface from "../service/LoggerInterface";
import { QueryMetadata } from "../decorator/Query";
import { MutationMetadata } from "../decorator/Mutation";
import { FieldMetadata } from "../decorator/Field";
import Request from "../core/Request";
import RequestContext from "../core/RequestContext";
import HookHelper from "../hook/HookHelper";

export type GraphQLRouteArgs<TData = any, TMeta = any, TParent = any> = {
  request: express.Request;
  response: express.Response;
  context: RequestContext;
  data: TData;
  meta: TMeta;
  info: any;
  parent: TParent;
};
export type GraphQLFieldArgs<TParent = any, TData = any, TMeta = any> = GraphQLRouteArgs<TData, TMeta, TParent>;

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

type Instance = object;
type QueryDefinition = QueryMetadata & { instance: Instance };
type MutationDefinition = MutationMetadata & { instance: Instance };
type FieldDefinition = FieldMetadata & { instance: Instance };

class GraphQLRouter implements RouterInterface {
  private queries: QueryDefinition[] = [];
  private mutations: MutationDefinition[] = [];
  private fields: Record<string, Record<string, FieldDefinition>> = {};
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
          ...(data as QueryMetadata),
          instance
        });
      } else if (data.type === "mutation") {
        this.mutations.push({
          ...(data as MutationMetadata),
          instance
        });
      } else if (data.type === "field") {
        if (!this.fields[data.entity as string]) {
          this.fields[data.entity as string] = {};
        }

        this.fields[data.entity][data.field] = {
          ...data,
          instance
        } as any;
      }
    }
  }

  $integrate(app: express.Application, helpers: AppHelpers) {
    const logExtensionFactory = () => new LogExtension(helpers.getLogger());
    const getAppFromContext = ({ req, res }) => {
      return new Request(req, res);
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

  private createCaller(
    obj: QueryDefinition | MutationDefinition | FieldDefinition
  ) {
    return async (parent, args, request: Request, info) => {
      request.setData(args);
      await HookHelper.passThrough(
        "request",
        obj.instance,
        obj.methodName,
        request
      );

      return this.callInstance(obj.instance, obj.methodName, {
        data: request.getData(),
        context: request.getContext(),
        meta: request.getMeta(),
        response: request.getResponse(),
        request: request.getRequest(),
        parent,
        info
      });
    };
  }

  private buildResolvers() {
    const queryHandlers = {};
    const mutationHandlers = {};

    this.queries.forEach(obj => {
      queryHandlers[obj.name] = this.createCaller(obj);
    });

    this.mutations.forEach(obj => {
      mutationHandlers[obj.name] = this.createCaller(obj);
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
        types[key][fieldName] = this.createCaller(data);
      });
    });

    return {
      ...types,
      ...this.config.types
    };
  }

  private callInstance(instance, method, args: GraphQLRouteArgs) {
    return instance[method]({
      data: args.data,
      meta: args.meta,
      request: args.request,
      response: args.response,
      parent: args.parent,
      info: args.info,
      context: args.context,
    });
  }
}

export default GraphQLRouter;
