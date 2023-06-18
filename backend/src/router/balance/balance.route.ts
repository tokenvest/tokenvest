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

        if (!token) {
          throw new Error('No JWT token found in cookies.');
        }
        const data: Token = app.jwt.verify(token);

        // get native balance (Ethereum)
        const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
          chain: '0xaa36a7',
          address: data.address,
        });

        // get token balance (tUSD)
        const coins = await Moralis.EvmApi.token.getWalletTokenBalances({
          chain: '0xaa36a7',
          address: data.address,
        });
        const tUSDBalance = coins.raw.filter(
          (token) => token.token_address === '0x47f917ee1b0be0d5fb51d45c0519882875fb3457',
        )[0];

        //get NFTs
        const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
          chain: '0xaa36a7',
          address: data.address,
        });
        console.log('nfts: ', nfts.result);
        res.send({ tUSDBalance, nativeBalance, nfts });
      } catch (error) {
        console.log('error: ', error.message);
        return res.status(403).send(error.message);
      }
    },
  });

  next();
};
