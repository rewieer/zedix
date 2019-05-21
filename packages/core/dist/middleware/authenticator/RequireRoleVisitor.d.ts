import { SchemaDirectiveVisitor } from "graphql-tools";
/**
 * Ensure the user has the role
 */
export declare const createRequireRoleVisitor: (config: {
    getUser: (context: any) => any;
    hasRole: (user: any, role: string) => boolean;
}) => typeof SchemaDirectiveVisitor;
