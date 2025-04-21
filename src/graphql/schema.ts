import { makeExecutableSchema } from '@graphql-tools/schema';
import { userResolvers } from './resolvers/user';
import { userTypeDefs } from './typeDefs/user';

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs],
  resolvers: [userResolvers],
});
