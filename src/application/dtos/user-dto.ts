import * as yup from "yup";

export const createUserSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  balance: yup.number().required().min(1),
});

export const updateUserSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

export type CreateUserDTO = yup.InferType<typeof createUserSchema>;

export type UpdateUserDTO = yup.InferType<typeof updateUserSchema>;
