import { SchemaDirectiveVisitor } from "graphql-tools";
/**
 * Authenticate the user, or throws an exception
 * @param conf
 */
export declare const createAuthenticatedVisitor: (conf: {
    isAuthenticated: (context: any) => boolean;
    unauthenticatedError: () => Error;
}) => typeof SchemaDirectiveVisitor;
