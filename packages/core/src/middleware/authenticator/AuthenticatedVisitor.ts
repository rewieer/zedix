import { SchemaDirectiveVisitor } from "graphql-tools";
import { GraphQLField, GraphQLInterfaceType, GraphQLObjectType } from "graphql";

/**
 * GraphQL directive that authenticate the user, or throws an exception
 * @param conf
 */
export const createAuthenticatedVisitor = (conf: {
  isAuthenticated: (context: any) => boolean;
  unauthenticatedError: () => Error;
}): typeof SchemaDirectiveVisitor => {
  return class extends SchemaDirectiveVisitor {
    visitFieldDefinition(
      field: GraphQLField<any, any>,
      details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
    ): GraphQLField<any, any> | void | null {
      let previousResolve = field.resolve;
      field.resolve = (parent, args, context, info) => {
        if (!conf.isAuthenticated(context)) throw conf.unauthenticatedError();

        return previousResolve(parent, args, context, info);
      };
    }
  };
};
