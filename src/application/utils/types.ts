import { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  export interface FastifyInstance {
    transactionSecurity: any;
    authenticate: any;
  }

  export interface FastifyRequest {
    session: string | JwtPayload;
    transaction_security_hash: string;
  }
}
