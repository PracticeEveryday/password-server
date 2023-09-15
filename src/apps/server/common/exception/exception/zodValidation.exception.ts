import { ZodError } from 'zod';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { ErrorTypeEnum } from '@commons/variable/enum/errorType.enum';

export class ZodValidationException extends BaseException {
  constructor(errors: ZodError, errorResponse: ErrorResponse) {
    super({
      statusCode: 400,
      errorResponse,
      raw: new Error(JSON.stringify(errors)),
      errorType: ErrorTypeEnum.WARN,
    });
  }
}
