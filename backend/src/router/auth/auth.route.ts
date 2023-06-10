import { FastifyPluginCallback } from 'fastify';
import {
  AuthMessageRequest,
  AuthVerifyRequest,
  authMessageSchema,
  authVerifySchema,
} from './auth.schema';
import Moralis from 'moralis';

export const authRoute: FastifyPluginCallback = (app, _, next) => {
  app.route({
    method: 'POST',
    url: '/api/auth/request-message',
    schema: authMessageSchema,
    handler: async (req: AuthMessageRequest, res) => {
      const { address, chain } = req.body;

      try {
        const config = {
          domain: import.meta.env.VITE_MORALIS_HOST,
          statement: 'Please sign this message to confirm your identity.',
          uri: import.meta.env.VITE_MORALIS_REACT_URL,
          timeout: 60,
        };

        const message = await Moralis.Auth.requestMessage({
          address,
          chain,
          ...config,
        });

        res.send(message);
      } catch (e) {
        res.status(400).send();
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
        const verify = await Moralis.Auth.verify({
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
          path: '/',
        });

        res.status(200).send(user);
      } catch (e) {
        res.status(400).send();
        console.log(e);
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
        return res.status(403).send();
      }
    },
  });

  app.route({
    method: 'GET',
    url: '/api/auth/logout',
    handler: async (req, res) => {
      try {
        res.clearCookie('jwt');
        return res.status(200).send();
      } catch {
        return res.status(403).send();
      }
    },
  });

  next();
};
