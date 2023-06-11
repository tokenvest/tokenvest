import { FastifyPluginCallback } from 'fastify';
import { User } from '~/database/models/user.model';
import { KYCRegisterRequest, kycRegisterSchema } from './kyc.schema';

interface Token {
  address: string;
  profileId: string;
  signature: string;
}

export const kycRoute: FastifyPluginCallback = (app, _, next) => {
  app.route({
    method: 'POST',
    url: '/api/kyc/register',
    schema: kycRegisterSchema,
    handler: async (req: KYCRegisterRequest, res) => {
      try {
        const token = req.cookies.jwt;

        if (!token) {
          throw new Error();
        }

        const data: Token = app.jwt.verify(token);

        const account = await User.findOne({ account: data.address });

        if (account) {
          return res.status(400).send("You've already registered");
        }

        try {
          await User.create({
            account: data.address,
            profileId: data.profileId,
            signature: data.signature,
            name: req.body.name,
            surname: req.body.surname,
            address: req.body.address,
          });
        } catch (e) {
          console.error(e);
        }

        res.send(data);
      } catch {
        return res.status(403).send();
      }
    },
  });

  app.route({
    method: 'GET',
    url: '/api/kyc/verify',
    handler: async (req, res) => {
      try {
        const token = req.cookies.jwt;

        if (!token) {
          throw new Error();
        }

        const data: Token = app.jwt.verify(token);

        const account = await User.findOne({ account: data.address });

        if (!account) {
          throw new Error();
        }

        res.send(data);
      } catch {
        return res.status(403).send();
      }
    },
  });

  next();
};
