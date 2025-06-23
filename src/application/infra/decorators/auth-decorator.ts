import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "@/application/errors";
import { verifyJwt } from "@/application/lib";

export async function authDecorator(request: FastifyRequest, _: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Authorization header is required");
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    throw new UnauthorizedError("Token is required");
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    throw new UnauthorizedError("Invalid token");
  }

  request.session = payload;
}
