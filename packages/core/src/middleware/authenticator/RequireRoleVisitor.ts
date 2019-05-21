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
  getUser: (context: any) => any;
  hasRole: (user: any, role: string) => boolean;
}): typeof SchemaDirectiveVisitor => {
  return class extends SchemaDirectiveVisitor {
    visitFieldDefinition(
      field: GraphQLField<any, any>,
      details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
    ): GraphQLField<any, any> | void | null {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = (root, args, context, info) => {
        const user = config.getUser(context);
        if (!user) return null;

        if (!config.hasRole(user, this.args.role)) {
          return null;
        }

        return resolve.call(this, root, args, context, info);
      };
    }
  };
};
