import * as express from "express";
import { SchemaDirectiveVisitor } from "graphql-tools";
import MiddlewareInterface from "../interface/MiddlewareInterface";
import RequestContext from "../core/RequestContext";
declare type AuthenticateFunction = (req: express.Request, context: RequestContext) => any;
declare type HasRoleFunction = (user: any, role: string) => boolean;
declare type AuthenticatorConfig = {
    authenticate: AuthenticateFunction;
    hasRole?: HasRoleFunction;
};
/**
 * @class Authenticator
 * Provide authentication mechanism to the framework
 */
declare class AuthenticatorBuilder {
    private readonly authenticate;
    private readonly hasRole?;
    constructor(conf: AuthenticatorConfig);
    toMiddleware(): MiddlewareInterface;
    toAuthenticatedDirective(): typeof SchemaDirectiveVisitor;
    toRequireRoleDirective(): typeof SchemaDirectiveVisitor;
}
export default AuthenticatorBuilder;
