"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const merge_graphql_schemas_1 = require("merge-graphql-schemas");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
class LogExtension {
    constructor(logger) {
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
        const loggedQuery = options.queryString || graphql_1.print(options.parsedQuery);
        this.logger.info(`GraphQL Request ${elapsedTime}${unit} `);
        if (options.graphqlResponse.errors) {
            options.graphqlResponse.errors.forEach((err) => {
                this.logger.error(err.stack);
            });
        }
    }
}
class GraphQLRouter {
    constructor(conf) {
        this.queries = [];
        this.mutations = [];
        this.fields = {};
        this.typedefs = [];
        this.directives = {};
        // Automatically load the schemas in the path
        const files = glob.sync(conf.schemaPath + "/**/*.ts");
        for (let path of files) {
            const typedef = require(path).default;
            if (typedef && typeof typedef === "string" && typedef.length > 0)
                this.typedefs.push(require(path).default);
        }
        this.directives = conf.directives;
        this.types = conf.types || {};
    }
    receiveMetadata(instance, metadata) {
        for (let data of metadata) {
            if (data.type === "query") {
                this.queries.push(Object.assign({}, data, { instance }));
            }
            else if (data.type === "mutation") {
                this.mutations.push(Object.assign({}, data, { instance }));
            }
            else if (data.type === "field") {
                if (!this.fields[data.entity]) {
                    this.fields[data.entity] = {};
                }
                this.fields[data.entity][data.field] = Object.assign({}, data, { instance });
            }
        }
    }
    integrate(app, helpers) {
        this.server = new apollo_server_express_1.ApolloServer({
            // @ts-ignore
            typeDefs: merge_graphql_schemas_1.mergeTypes(this.typedefs, { all: true }),
            resolvers: this.buildResolvers(),
            schemaDirectives: this.directives,
            extensions: [() => new LogExtension(helpers.getLogger())],
            context: ({ res }) => {
                return res.locals.app;
            }
        });
        this.server.applyMiddleware({
            app
        });
    }
    buildResolvers() {
        const queryHandlers = {};
        const mutationHandlers = {};
        this.queries.forEach(obj => {
            queryHandlers[obj.name] = (parent, args, context, info) => {
                return this.callInstance(obj.instance, obj.methodName, parent, args, context, info);
            };
        });
        this.mutations.forEach(obj => {
            mutationHandlers[obj.name] = (parent, args, context, info) => {
                return this.callInstance(obj.instance, obj.methodName, parent, args, context, info);
            };
        });
        let resolvers = {};
        if (this.queries.length > 0) {
            resolvers.Query = queryHandlers;
        }
        if (this.mutations.length > 0) {
            resolvers.Mutation = mutationHandlers;
        }
        const types = this.buildTypes();
        if (Object.keys(types).length > 0) {
            resolvers = Object.assign({}, resolvers, types);
        }
        return resolvers;
    }
    /**
     * Build the list of types, which correspond to the different fields
     */
    buildTypes() {
        const types = {};
        Object.keys(this.fields).forEach(key => {
            const data = this.fields[key];
            if (!types[key]) {
                types[key] = {};
            }
            Object.keys(data).forEach(fieldName => {
                const data = this.fields[key][fieldName];
                types[key][fieldName] = (entity, args, context, info) => {
                    return this.callFieldResolver(data.instance, data.methodName, entity, args, context, info);
                };
            });
        });
        return Object.assign({}, types, this.types);
    }
    callInstance(instance, method, parent, args, context, info) {
        return instance[method](args, context, info, parent);
    }
    callFieldResolver(instance, method, entity, args, context, info) {
        return instance[method](entity, args, context, info);
    }
}
exports.default = GraphQLRouter;
//# sourceMappingURL=GraphQLRouter.js.map