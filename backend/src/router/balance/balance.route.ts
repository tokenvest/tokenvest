import { FastifyPluginCallback } from 'fastify';
import Moralis from 'moralis';

interface Token {
  address: string;
  profileId: string;
  signature: string;
}

export const balanceRoute: FastifyPluginCallback = (app, _, next) => {
  app.route({
    method: 'GET',
    url: '/api/balance',
    handler: async (req, res) => {
      try {
        const token = req.cookies.jwt;

        if (!token) {
          throw new Error();
        }

        const data: Token = app.jwt.verify(token);

        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
          chain: '0xaa36a7',
          address: data.address,
        });

        const balance = response.raw?.[0];

        if (!balance || !balance.symbol) {
          return res.status(400).send();
        }

        res.send({
          symbol: balance.symbol,
          balance: balance.balance,
        });
      } catch {
        return res.status(403).send();
      }
    },
  });

  next();
};
