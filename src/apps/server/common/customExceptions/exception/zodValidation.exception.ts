import { ZodError } from 'zod';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';
import ErrorResponse from '@commons/customExceptions/errorResponse';

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
