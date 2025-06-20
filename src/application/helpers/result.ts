import { AppError } from "../errors";

type TResultSuccess<T> = {
  result: T;
  success: true;
  statusCode?: number;
};

type TResultError<E> = {
  error: E;
  success: false;
};

export type TResult<T, E extends AppError = AppError> =
  | TResultSuccess<T>
  | TResultError<E>;

export const serverError = <E extends AppError>(error: E) => ({
  error,
  success: false,
});
