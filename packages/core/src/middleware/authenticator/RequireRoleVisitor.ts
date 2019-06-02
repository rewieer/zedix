import { SchemaDirectiveVisitor } from "graphql-tools";
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType
} from "graphql";

/**
 * Ensure the user has the role
 */
export const createRequireRoleVisitor = (config: {
  getUser: (context: any) => any
  hasRole: (user: any, role: string) => boolean
  unauthenticatedError: () => Error
  authorizationError: () => Error
}): typeof SchemaDirectiveVisitor => {
  return class extends SchemaDirectiveVisitor {
    visitFieldDefinition(
      field: GraphQLField<any, any>,
      details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
    ): GraphQLField<any, any> | void | null {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = (root, args, context, info) => {
        const user = config.getUser(context);
        if (!user) {
          throw config.unauthenticatedError();
        }

        if (!config.hasRole(user, this.args.role)) {
          throw config.authorizationError();
        }

        return resolve.call(this, root, args, context, info);
      };
    }
  };
};
