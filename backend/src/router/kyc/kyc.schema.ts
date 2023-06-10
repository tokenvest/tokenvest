import { FastifyRequest } from 'fastify';
import schema from 'fluent-json-schema';

export type KYCRegisterRequest = FastifyRequest<{
  Body: {
    name: string;
    surname: string;
    address: string;
  };
}>;

export const kycRegisterSchema = {
  body: schema
    .object()
    .prop('name', schema.string().required())
    .prop('surname', schema.string().required())
    .prop('address', schema.string().required()),
};
