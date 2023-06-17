import { error } from 'console';
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
        console.log('cookie token: ', token);

        // if (!token) {
        //   throw new Error('No JWT token found in cookies.');
        // }

        const data: Token = app.jwt.verify(token);

        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
          chain: '0xaa36a7',
          address: data.address,
        });
        // const balance = response.raw?.[0];
        // console.log(balance);

        // if (!balance || !balance.symbol) {
        //   return res.status(400).send();
        // }

        // res.send({
        //   symbol: balance.symbol,
        //   balance: balance.balance,
        // });

        const tUSDBalance = response.raw.filter(
          (token) => token.token_address === '0x47f917ee1b0be0d5fb51d45c0519882875fb3457',
        )[0];
        console.log('tusd balance', tUSDBalance.balance);
        res.send(tUSDBalance);
      } catch (error) {
        console.log('error: ', error.message);
        return res.status(403).send(error.message);
      }
    },
  });

  next();
};
