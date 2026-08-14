export type AppErrorCode =
  'network' | 'timeout' | 'http_error' | 'not_found' | 'permission_denied' | 'unknown';

type AppErrorOptions = {
  cause?: unknown;
  status?: number;
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly userMessage: string;
  readonly status?: number;
  readonly cause?: unknown;

  constructor(code: AppErrorCode, userMessage: string, options: AppErrorOptions = {}) {
    super(userMessage);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
    this.status = options.status;
    this.cause = options.cause;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
