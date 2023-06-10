import { FastifyPluginCallback } from 'fastify';
import Moralis, { MoralisConfigValues } from 'moralis';

const moralis: FastifyPluginCallback<MoralisConfigValues> = async (app, opts, done) => {
  const config = {
    domain: import.meta.env.VITE_MORALIS_HOST,
    statement: 'Please sign this message to confirm your identity.',
    uri: import.meta.env.VITE_MORALIS_REACT_URL,
    timeout: 60,
  };

  app.decorate('moralis', {
    ...Moralis,
    config,
  });

  done();
};

moralis[Symbol.for('skip-override')] = true;

export default moralis;
