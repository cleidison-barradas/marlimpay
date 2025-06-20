import { HTTP_STATUS_CODE } from "./types";

export abstract class AppError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = HTTP_STATUS_CODE.STATUS_INTERNAL_SERVER_ERROR,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.STATUS_INTERNAL_SERVER_ERROR);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.STATUS_BAD_REQUEST);
  }
}
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.STATUS_NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.STATUS_UNAUTHORIZED);
  }
}

export class TooManyRequestError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.STATUS_TOO_MANY_REQUESTS);
  }
}

export class IdempotencyError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.STATUS_CONFLICT);
  }
}
