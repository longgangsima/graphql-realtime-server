import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    addUser(name: String!): User!
  }

  type Subscription {
    userAdded: User!
  }
`;
