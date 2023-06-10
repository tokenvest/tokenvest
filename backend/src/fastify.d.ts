import pinataSDK from '@pinata/sdk';

declare module 'fastify' {
  interface FastifyInstance {
    pinata: pinataSDK;
  }
}
