import {
  IUserRepository,
  ITransactionRepository,
  ITransactionSecurityRepository,
} from "../infra";
import { CreateTransactionDTO } from "../dtos";
import { BadRequestError, NotFoundError } from "../errors";

export class CreateTransactionUsecase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository,
    private readonly transactionSecurityRepository: ITransactionSecurityRepository,
  ) {}

  async execute({
    payer_id,
    receiver_id,
    amount,
    security_hash,
  }: CreateTransactionDTO) {
    const [payerResponse, receiverResponse] = await Promise.all([
      this.userRepository.findById(payer_id),
      this.userRepository.findById(receiver_id),
    ]);

    const payer = payerResponse.success ? payerResponse.result : null;
    const receiver = receiverResponse.success ? receiverResponse.result : null;

    if (!payer || !receiver) {
      throw new NotFoundError("Payer or receiver not found.");
    }

    if (payer.balance < amount) {
      throw new BadRequestError(
        "Payer does not have enough balance to complete the transaction.",
      );
    }

    const transaction = await this.transactionRepository.createOne({
      amount,
      payer_id,
      receiver_id,
      security_hash,
    });

    if (transaction.success) {
      const new_balance = Number(payer.balance) - Number(amount);

      await this.userRepository.updateBalance(payer_id, new_balance);

      await this.transactionSecurityRepository.updateTransactionSecurityStatus(
        security_hash,
        "completed",
      );
    }

    return transaction;
  }
}
