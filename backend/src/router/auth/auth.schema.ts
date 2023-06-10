import { FastifyRequest } from 'fastify';
import schema from 'fluent-json-schema';

export type AuthMessageRequest = FastifyRequest<{
  Body: {
    address: string;
    chain: string;
    network: string;
  };
}>;

export type AuthVerifyRequest = FastifyRequest<{
  Body: {
    message: string;
    signature: string;
  };
}>;

export const authMessageSchema = {
  body: schema
    .object()
    .prop('address', schema.string().required())
    .prop('chain', schema.string().required())
    .prop('network', schema.string().required()),
};

export const authVerifySchema = {
  body: schema
    .object()
    .prop('message', schema.string().required())
    .prop('signature', schema.string().required()),
};
