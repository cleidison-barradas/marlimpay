import * as yup from "yup";

export const createTransactionSchema = yup.object().shape({
  amount: yup.number().required().min(1),
  payer_id: yup.string().required(),
  receiver_id: yup.string().required(),
  security_hash: yup.string().required(),
});

export const updateTransactionStatusSchema = yup.object().shape({
  transaction_id: yup.string().required(),
  status: yup.string().oneOf(["pending", "approved", "failed"]).required(),
});

export type CreateTransactionDTO = yup.InferType<
  typeof createTransactionSchema
>;

export type UpdateTransactionStatusDTO = yup.InferType<
  typeof updateTransactionStatusSchema
>;
