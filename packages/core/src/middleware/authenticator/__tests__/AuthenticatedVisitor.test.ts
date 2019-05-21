import "jest";

import { createAuthenticatedVisitor } from "../AuthenticatedVisitor";
import RequestContext from "../../../core/RequestContext";
import {
  GraphQLField,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from "graphql";

const Author = new GraphQLObjectType({
  name: "Author",
  description: "An author",
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    firstName: {
      type: GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: GraphQLNonNull(GraphQLString)
    }
  })
});

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      getAuthor: {
        type: Author,
        resolve: () => {
          return {
            id: 1,
            firstName: "John",
            lastName: "Doe"
          };
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: "RootMutationType",
    fields: {}
  }),
  types: [Author]
});

it("should throw when no user could be authenticated", async () => {
  const conf = {
    isAuthenticated: jest.fn(ctx => ctx.get("user") != undefined),
    unauthenticatedError: jest.fn(() => new Error("Oh no"))
  };

  const Klass = createAuthenticatedVisitor(conf);
  // @ts-ignore
  const visitor = new Klass({
    name: "someVisitor",
    args: {},
    visitedType: Author,
    schema: Schema,
    context: null
  });

  const field: GraphQLField<any, any> = Schema.getQueryType().getFields()[
    "getAuthor"
  ];
  visitor.visitFieldDefinition(field, { objectType: Author });

  expect(() => {
    field.resolve(null, {}, new RequestContext(), null);
  }).toThrow("Oh no");
});

it("should pass when user could be authenticated", async () => {
  const conf = {
    isAuthenticated: jest.fn(ctx => ctx.get("user") != undefined),
    unauthenticatedError: jest.fn(() => new Error("Oh no"))
  };

  const Klass = createAuthenticatedVisitor(conf);
  // @ts-ignore
  const visitor = new Klass({
    name: "someVisitor",
    args: {},
    visitedType: Author,
    schema: Schema,
    context: null
  });

  const field: GraphQLField<any, any> = Schema.getQueryType().getFields()[
    "getAuthor"
  ];
  visitor.visitFieldDefinition(field, { objectType: Author });

  const ctx = new RequestContext();
  ctx.set("user", { id: 1 });
  const result = field.resolve(null, {}, ctx, null);

  expect(result).toEqual({
    id: 1,
    firstName: "John",
    lastName: "Doe"
  });
});
