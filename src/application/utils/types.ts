declare module "fastify" {
  export interface FastifyInstance {
    transactionSecurity: any;
  }

  export interface FastifyRequest {
    transaction_security_hash: string;
  }
}
