import type { FastifyServerOptions } from 'fastify';
import Moralis from 'moralis';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { fastify } from 'fastify';
import { authRoute } from './router/auth/auth.route';
import { establishDatabaseConnection } from './database/connect';

const initServer = async (opts?: FastifyServerOptions) => {
  const app = fastify(opts);

  await establishDatabaseConnection();

  await Moralis.start({
    apiKey: import.meta.env.VITE_MORALIS_API_KEY,
  });

  app.register(cors, {
    origin: '*',
  });


  app.register(jwt, {
    secret: import.meta.env.VITE_JWT_SECRET,
  });

  app.register(cookie, {
    secret: import.meta.env.VITE_MORALIS_AUTH_SECRET,
    hook: 'onRequest',
  });

  app.register(authRoute);
  if (import.meta.env.PROD) {
    try {
      const PORT = 6543;
      app.listen({ port: PORT });
      console.log('Listening on port:', PORT);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  return app;
};

export const viteNodeApp = initServer();
