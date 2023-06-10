import type { FastifyServerOptions } from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { fastify } from 'fastify';
import pinata from './plugins/pinata.plugin';
import { propertiesRoute } from './router/properties.route';
import { establishDatabaseConnection } from './database/connect';

const initServer = async (opts?: FastifyServerOptions) => {
  const app = fastify(opts);

  await establishDatabaseConnection();

  app.register(cors, {
    origin: '*',
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
