import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { WebSocketServer } from 'ws';
import { schema } from './graphql/schema';
import { prisma } from './lib/prisma';

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  useServer({ schema }, wsServer);

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const PORT = 4000;

  // ✅ DEBUG 1: Check DATABASE_URL at runtime
  console.log('🧪 DATABASE_URL =', process.env.DATABASE_URL);

  // ✅ DEBUG 2: Check Prisma Client connects successfully
  try {
    await prisma.$connect();
    console.log('✅ Connected to Supabase PostgreSQL via Prisma');
  } catch (err) {
    console.error('❌ Failed to connect to DB via Prisma:', err);
    process.exit(1); // Stop container if DB can't connect
  }

  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP ready at http://localhost:${PORT}/graphql`);
    console.log(`🔄 WebSocket ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch(err => {
  console.log('Server error: ', err);
});
