import { CreateUserDTO } from "../dtos";
import { BadRequestError } from "../errors";
import { IUserRepository } from "../infra";

export class CreateUserUsecase {
  constructor(private readonly repository: IUserRepository) {}
  async execute(data: CreateUserDTO) {
    let response = await this.repository.findByEmail(data.email);

    if (response.success && response.result) {
      throw new BadRequestError("User email already in use");
    }

    response = await this.repository.createOne(data);

    return response;
  }
}
