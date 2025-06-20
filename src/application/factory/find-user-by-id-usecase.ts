import { IUserRepository } from "../infra";
import { NotFoundError } from "../errors";

export class FindUserByIdUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: string) {
    const response = await this.repository.findById(id);

    const user = response.success ? response.result : null;

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return response;
  }
}
