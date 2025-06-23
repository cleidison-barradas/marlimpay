import { CreateUserDTO, createUserSchema } from "../dtos";
import { BadRequestError } from "../errors";
import { IUserRepository } from "../infra";
import { yupValidator } from "../helpers";

export class CreateUserUsecase {
  constructor(private readonly repository: IUserRepository) {}
  async execute(data: CreateUserDTO) {
    await yupValidator(createUserSchema, data);

    let response = await this.repository.findByEmail(data.email);

    if (response.success && response.result) {
      throw new BadRequestError("User email already in use");
    }

    response = await this.repository.createOne(data);

    return response;
  }
}
