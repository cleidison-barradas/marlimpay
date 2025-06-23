import { ITransactionRepository, IUserRepository } from "../infra";
import { BadRequestError, NotFoundError } from "../errors";
import {
  UpdateTransactionStatusDTO,
  updateTransactionStatusSchema,
} from "../dtos";
import { yupValidator } from "../helpers";

export class UpdateTransactionStatusUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ transaction_id, status }: UpdateTransactionStatusDTO) {
    await yupValidator(updateTransactionStatusSchema, {
      transaction_id,
      status,
    });

    const response =
      await this.transactionRepository.getTransactionById(transaction_id);

    const transaction = response.success ? response.result : null;

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    if (transaction.status === status) {
      throw new BadRequestError(`The transaction is already ${status}`);
    }

    if (status === "failed") {
      const userResponse = await this.userRepository.findById(
        String(transaction.payer_id),
      );

      const user = userResponse.success ? userResponse.result : null;

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const refound_balance = user.balance + transaction.amount;

      await this.userRepository.updateBalance(
        String(transaction.payer_id),
        refound_balance,
      );
    }
    return this.transactionRepository.updateTransactionStatus(
      transaction_id,
      status,
    );
  }
}
