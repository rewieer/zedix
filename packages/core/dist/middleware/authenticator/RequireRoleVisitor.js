"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const graphql_1 = require("graphql");
/**
 * Ensure the user has the role
 */
exports.createRequireRoleVisitor = (config) => {
    return class extends graphql_tools_1.SchemaDirectiveVisitor {
        visitFieldDefinition(field, details) {
            const { resolve = graphql_1.defaultFieldResolver } = field;
            field.resolve = (root, args, context, info) => {
                const user = config.getUser(context);
                if (!user)
                    return null;
                if (!config.hasRole(user, this.args.role)) {
                    return null;
                }
                return resolve.call(this, root, args, context, info);
            };
        }
    };
};
//# sourceMappingURL=RequireRoleVisitor.js.map