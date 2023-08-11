import { Injectable } from '@nestjs/common';
import { z, ZodError } from 'zod';

import ErrorResponse from '@commons/customExceptions/errorResponse';
import { NotFoundException } from '@commons/customExceptions/exception';
import { ZodValidationException } from '@commons/customExceptions/exception/zodValidation.exception';

@Injectable()
export class ValidateUtilService {
  public ValidatePassword(password: unknown, errorResponse: ErrorResponse) {
    try {
      const PasswordSchema = z.object({
        id: z.number(),
        password: z.string(),
        domain: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        deletedAt: z.date().optional().nullable(),
      });

      PasswordSchema.parse(password);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new ZodValidationException(error, errorResponse);
      }
    }
  }

  public isStrictNotEmpty(param: unknown, errorResponse: ErrorResponse) {
    if (param) throw new NotFoundException({ errorResponse });

    if (Array.isArray(param) && param.length !== 0) throw new NotFoundException({ errorResponse });
  }

  public isStrictEmpty(param: unknown, errorResponse: ErrorResponse) {
    if (!param) throw new NotFoundException({ errorResponse });

    if (Array.isArray(param) && param.length === 0) throw new NotFoundException({ errorResponse });
  }
}
