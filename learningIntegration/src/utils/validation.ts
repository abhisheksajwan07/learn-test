import { validationResult } from 'express-validator';
import { Request } from 'express';
import { ValidationError } from '../errors/HttpError.js';

interface ValidationErrorItem {
  field: string;
  message: string;
}

export const validateRequest = (req: Request) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: 'path' in error ? error.path : 'param' in error ? error.param : 'unknown',
      message: error.msg,
    }));

    throw new ValidationError(
      `Validation failed: ${JSON.stringify(errorMessages)}`
    );
  }
};

export const formatValidationErrors = (errors: ValidationErrorItem[]) => {
  return errors.map((error) => ({
    field: error.field,
    message: error.message,
  }));
};
