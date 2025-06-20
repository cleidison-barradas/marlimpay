import { AppError } from "../errors";

type TResultSuccess<T> = {
  result: T;
  success: true;
};

type TResultError<E> = {
  error: E;
  success: false;
};

export type TResult<T, E extends AppError = AppError> =
  | TResultSuccess<T>
  | TResultError<E>;
