import * as express from "express";
import { AuthenticationError } from "apollo-server";
import { SchemaDirectiveVisitor } from "graphql-tools";

import MiddlewareInterface, {
  MiddlewareRequest
} from "../interface/MiddlewareInterface";
import RequestContext from "../core/RequestContext";
import { createAuthenticatedVisitor } from "./authenticator/AuthenticatedVisitor";
import { createRequireRoleVisitor } from "./authenticator/RequireRoleVisitor";

type AuthenticateFunction = (
  req: express.Request,
  context: RequestContext
) => any;
type HasRoleFunction = (user: any, role: string) => boolean;
type AuthenticatorConfig = {
  authenticate: AuthenticateFunction;
  hasRole?: HasRoleFunction;
};

const isAuthenticatedFromContext = context => context.get("user") !== null;
const getUserFromContext = context => context.get("user");

/**
 * @class Authenticator
 * Provide authentication mechanism to the framework
 */
class AuthenticatorBuilder {
  private readonly authenticate: AuthenticateFunction;
  private readonly hasRole?: HasRoleFunction;

  constructor(conf: AuthenticatorConfig) {
    this.authenticate = conf.authenticate;
    this.hasRole = conf.hasRole;
  }

  public toMiddleware(): MiddlewareInterface {
    return new AuthenticatorMiddleware(this.authenticate);
  }

  public toAuthenticatedDirective(): typeof SchemaDirectiveVisitor {
    return createAuthenticatedVisitor({
      isAuthenticated: isAuthenticatedFromContext,
      unauthenticatedError: () => new AuthenticationError("You must be authenticated.")
    });
  }

  public toRequireRoleDirective(): typeof SchemaDirectiveVisitor {
    return createRequireRoleVisitor({
      getUser: getUserFromContext,
      hasRole: this.hasRole,
      unauthenticatedError: () => new AuthenticationError("You must be authenticated."),
      authorizationError: () => new Error("You must be authorized to access this data.")
    });
  }
}

/**
 * @class AuthenticatorMiddleware
 * Middleware implementing authentication
 */
class AuthenticatorMiddleware implements MiddlewareInterface {
  private authenticate: AuthenticateFunction;

  constructor(authenticate: AuthenticateFunction) {
    this.authenticate = authenticate;
  }

  async handle(
    req: MiddlewareRequest,
    context: RequestContext,
    next: express.NextFunction
  ) {
    const result = await this.authenticate(req, context);
    context.set("user", result || null);
    next();
  }
}

export default AuthenticatorBuilder;
