import pinataSDK from '@pinata/sdk';
import Moralis from 'moralis';

interface MoralisMessageConfig {
  config: {
    domain: string;
    statement: string;
    uri: string;
    timeout: number;
  };
}

declare module 'fastify' {
  interface FastifyInstance {
    moralis: typeof Moralis & MoralisMessageConfig;
  }
}
