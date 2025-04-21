import { prisma } from '../../lib/prisma';
import { pubsub, USER_ADDED } from '../subscriptions';

// Temporary in-memory "database"
// let users = [
//   { id: '1', name: 'Alice' },
//   { id: '2', name: 'Bob' },
//   { id: 3, name: 'lin' },
// ];

export const userResolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    addUser: async (_: any, { name }: { name: string }) => {
      const newUser = await prisma.user.create({
        data: { name },
      });
      pubsub.publish(USER_ADDED, { userAdded: newUser });
      return newUser;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(USER_ADDED),
    },
  },
};
