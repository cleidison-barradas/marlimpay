import * as yup from "yup";

export const createTransactionSecuritySchema = yup.object().shape({
  amount: yup.number().required().min(1),
  payer_id: yup.string().required(),
  receiver_id: yup.string().required(),
});

export type CreateTransactionSecurityDTO = yup.InferType<
  typeof createTransactionSecuritySchema
>;
