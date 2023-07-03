import type { FastifyServerOptions } from 'fastify';
import Moralis from 'moralis';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { fastify } from 'fastify';
import { authRoute } from './router/auth/auth.route';
import { establishDatabaseConnection } from './database/connect';
import { kycRoute } from './router/kyc/kyc.route';
import { balanceRoute } from './router/balance/balance.route';

const initServer = async (opts?: FastifyServerOptions) => {
  const app = fastify(opts);

  await establishDatabaseConnection();

  app.register(cors, {
    origin: true, //import.meta.env.VITE_MORALIS_REACT_URL,
    credentials: true,
  });

  app.register(jwt, {
    secret: import.meta.env.VITE_JWT_SECRET,
  });

  app.register(cookie, {
    secret: import.meta.env.VITE_MORALIS_AUTH_SECRET,
  });

  app.register(authRoute);
  app.register(balanceRoute);
  app.register(kycRoute);

  await Moralis.start({
    apiKey: import.meta.env.VITE_MORALIS_API_KEY,
  });

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
