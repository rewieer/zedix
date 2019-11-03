import * as express from "express";
import { AuthenticationError } from "apollo-server";
import { SchemaDirectiveVisitor } from "graphql-tools";

import MiddlewareInterface, {
  MiddlewareRequest
} from "../../interface/MiddlewareInterface";
import RequestContext from "../../core/RequestContext";
import { createAuthenticatedVisitor } from "./AuthenticatedVisitor";
import { createRequireRoleVisitor } from "./RequireRoleVisitor";

// --- Types
type AuthenticateFunction = (
  req: express.Request,
  context: RequestContext
) => any;
type HasRoleFunction = (user: any, role: string) => boolean;
type AuthenticatorConfig = {
  authenticate: AuthenticateFunction;
  hasRole?: HasRoleFunction;
};

// --- Utils
const isAuthenticatedFromContext = context => context.get("user") !== null;
const getUserFromContext = context => context.get("user");
const createUnauthenticatedError = () => new AuthenticationError("You must be authenticated.");
const createUnauthorizedError = () => new Error("You must be authorized to access this data.");

/**
 * @class Authenticator
 * Provide authentication mechanism to the framework.
 * It appends a "user" property into the express context corresponding to the user currently logged in.
 * It uses two functions :
 * - authenticate : perform the actual authentication and must return a user. Is called async so can return a promise.
 * - hasRole : verify if the user has the required role to perform the action.
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

  /**
   * Creates a GraphQL directive that asserts the user is authenticated.
   */
  public toAuthenticatedDirective(): typeof SchemaDirectiveVisitor {
    return createAuthenticatedVisitor({
      isAuthenticated: isAuthenticatedFromContext,
      unauthenticatedError: createUnauthenticatedError
    });
  }

  /**
   * Creates a GraphQL directive that asserts the user is authorized.
   */
  public toRequireRoleDirective(): typeof SchemaDirectiveVisitor {
    return createRequireRoleVisitor({
      getUser: getUserFromContext,
      hasRole: this.hasRole,
      unauthenticatedError: createUnauthenticatedError,
      authorizationError: createUnauthorizedError
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
