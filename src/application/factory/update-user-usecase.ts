import { UpdateUserDTO, updateUserSchema } from "../dtos";
import { BadRequestError, NotFoundError } from "../errors";
import { yupValidator } from "../helpers";

import { IUserRepository } from "../infra";

export class UpdateUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO) {
    await yupValidator(updateUserSchema, data);

    const response = await this.repository.findById(id);

    const user = response.success ? response.result : null;

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userWithSameEmail = await this.repository.findByEmail(data.email, id);

    if (userWithSameEmail.success && userWithSameEmail.result) {
      throw new BadRequestError("User email already in use");
    }

    return this.repository.updateOne(id, data);
  }
}
