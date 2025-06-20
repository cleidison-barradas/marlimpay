import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateUserUseCase } from "@/application/factory/make/make-create-user-usecase";
import { makeUpdateUserUseCase } from "@/application/factory/make/make-update-user-usecase";
import { makeFindUserByIdUseCase } from "@/application/factory/make/make-find-use-by-id-usecase";
import { CreateUserDTO, UpdateUserDTO } from "@/application/dtos";

export class UsersController {
  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const {
      params: { id },
    } = request;
    const usecase = makeFindUserByIdUseCase();

    const response = await usecase.execute(id);

    return reply
      .status(response.success ? 200 : response.error.statusCode)
      .send(response);
  }
  async create(
    request: FastifyRequest<{ Body: CreateUserDTO }>,
    reply: FastifyReply,
  ) {
    const usecase = makeCreateUserUseCase();

    const response = await usecase.execute(request.body);

    return reply
      .status(response.success ? 201 : response.error.statusCode)
      .send(response);
  }

  async update(
    request: FastifyRequest<{ Body: UpdateUserDTO; Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const id = request.params.id;
    const usecase = makeUpdateUserUseCase();

    const response = await usecase.execute(id, request.body);

    return reply
      .status(response.success ? 200 : response.error.statusCode)
      .send(response);
  }
}
