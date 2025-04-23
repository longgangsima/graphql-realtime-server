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

  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to Supabase PostgreSQL');
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
  }

  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP ready at http://localhost:${PORT}/graphql`);
    console.log(`🔄 WebSocket ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch(err => {
  console.log('Server error: ', err);
});
