import * as express from "express";
import { SchemaDirectiveVisitor } from "apollo-server-express";
import RouterInterface from "../interface/RouterInterface";
import { Metadata } from "../core/MetadataCollector";
import { GraphQLScalarType } from "graphql";
import { AppHelpers } from "../types";
declare class GraphQLRouter implements RouterInterface {
    private queries;
    private mutations;
    private fields;
    private types;
    private typedefs;
    private server;
    private directives;
    constructor(conf: {
        schemaPath: string;
        directives?: Record<string, typeof SchemaDirectiveVisitor>;
        types?: {
            [key: string]: GraphQLScalarType;
        };
    });
    receiveMetadata(instance: object, metadata: Metadata[]): void;
    integrate(app: express.Application, helpers: AppHelpers): void;
    private buildResolvers;
    /**
     * Build the list of types, which correspond to the different fields
     */
    private buildTypes;
    private callInstance;
    private callFieldResolver;
}
export default GraphQLRouter;
