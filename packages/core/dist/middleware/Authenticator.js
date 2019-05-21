"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const AuthenticatedVisitor_1 = require("./authenticator/AuthenticatedVisitor");
const RequireRoleVisitor_1 = require("./authenticator/RequireRoleVisitor");
const isAuthenticatedFromContext = context => context.get("user") !== null;
const getUserFromContext = context => context.get("user");
/**
 * @class Authenticator
 * Provide authentication mechanism to the framework
 */
class AuthenticatorBuilder {
    constructor(conf) {
        this.authenticate = conf.authenticate;
        this.hasRole = conf.hasRole;
    }
    toMiddleware() {
        return new AuthenticatorMiddleware(this.authenticate);
    }
    toAuthenticatedDirective() {
        return AuthenticatedVisitor_1.createAuthenticatedVisitor({
            isAuthenticated: isAuthenticatedFromContext,
            unauthenticatedError: () => new apollo_server_1.AuthenticationError("You must be authenticated.")
        });
    }
    toRequireRoleDirective() {
        return RequireRoleVisitor_1.createRequireRoleVisitor({
            getUser: getUserFromContext,
            hasRole: this.hasRole
        });
    }
}
/**
 * @class AuthenticatorMiddleware
 * Middleware implementing authentication
 */
class AuthenticatorMiddleware {
    constructor(authenticate) {
        this.authenticate = authenticate;
    }
    handle(req, context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authenticate(req, context);
            context.set("user", result || null);
            next();
        });
    }
}
exports.default = AuthenticatorBuilder;
//# sourceMappingURL=Authenticator.js.map