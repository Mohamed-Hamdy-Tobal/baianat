export type ApiErrorCode = "network" | "timeout" | "http" | "invalid_json" | "invalid_shape";

export class ApiError extends Error {
  readonly status?: number;
  readonly code: ApiErrorCode;
  readonly cause?: unknown;

  constructor(message: string, options: { code: ApiErrorCode; status?: number; cause?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found", cause?: unknown) {
    super(message, { code: "http", status: 404, cause });
    this.name = "NotFoundError";
  }
}
