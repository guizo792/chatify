export interface IAppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: number;
  path?: string;
  value?: string;
  errmsg?: string;
  errors?: any;
}

class AppError extends Error implements IAppError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
