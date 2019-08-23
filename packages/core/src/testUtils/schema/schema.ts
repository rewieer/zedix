import gql from "graphql-tag";

export default `
  type Author {
      id: ID!
      name: String!
  }  
  
  type Query {
    author(id: ID!): Author  
  }
  type Mutation {
    updateAuthor(id: ID!, name: String!): Author
  }
`;
