"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
/**
 * Authenticate the user, or throws an exception
 * @param conf
 */
exports.createAuthenticatedVisitor = (conf) => {
    return class extends graphql_tools_1.SchemaDirectiveVisitor {
        visitFieldDefinition(field, details) {
            let previousResolve = field.resolve;
            field.resolve = (parent, args, context, info) => {
                if (!conf.isAuthenticated(context))
                    throw conf.unauthenticatedError();
                return previousResolve(parent, args, context, info);
            };
        }
    };
};
//# sourceMappingURL=AuthenticatedVisitor.js.map