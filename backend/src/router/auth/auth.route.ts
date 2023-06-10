import { FastifyPluginCallback } from 'fastify';
import {
  AuthMessageRequest,
  AuthVerifyRequest,
  authMessageSchema,
  authVerifySchema,
} from './auth.schema';

export const authRoute: FastifyPluginCallback = (app, _, next) => {
  app.route({
    method: 'POST',
    url: '/api/auth/request-message',
    schema: authMessageSchema,
    handler: async (req: AuthMessageRequest, res) => {
      const { address, chain, network } = req.body;
      try {
        const message = await app.moralis.Auth.requestMessage({
          address,
          chain,
          network,
          ...app.moralis.config,
        });

        res.send(message);
      } catch (e) {
        res.status(400).send({ error: e.message });
        console.error(e);
      }
    },
  });

  app.route({
    method: 'POST',
    url: '/api/auth/verify',
    schema: authVerifySchema,
    handler: async (req: AuthVerifyRequest, res) => {
      const { message, signature } = req.body;

      try {
        const verify = await app.moralis.Auth.verify({
          message,
          signature,
          networkType: 'evm',
        });

        const user = {
          address: verify.raw.address,
          profileId: verify.raw.profileId,
          signature,
        };

        const token = app.jwt.sign(user);

        res.setCookie('jwt', token, {
          httpOnly: true,
        });

        res.status(200).send(user);
      } catch (e) {
        res.status(400).send({ error: e.message });
        console.error(e);
      }
    },
  });

  app.route({
    method: 'GET',
    url: '/api/auth/authenticate',
    handler: async (req, res) => {
      try {
        const token = req.cookies.jwt;

        if (!token) {
          throw new Error();
        }

        const data = app.jwt.verify(token);

        res.send(data);
      } catch {
        return res.status(403).send({ message: 'Error authenticating' });
      }
    },
  });

  app.route({
    method: 'GET',
    url: '/api/auth/logout',
    handler: async (req, res) => {
      try {
        res.clearCookie('jwt');
        return res.status(200).send({ message: 'Logged out' });
      } catch {
        return res.status(403).send({ message: 'Error logging out' });
      }
    },
  });

  next();
};
