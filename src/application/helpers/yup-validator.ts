import * as yup from "yup";
import { BadRequestError } from "../errors";

export async function yupValidator<T>(schema: yup.AnySchema, data: T) {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new BadRequestError(error.errors.join(", "));
    }
    throw new BadRequestError("Invalid data");
  }
}
