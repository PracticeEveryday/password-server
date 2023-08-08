import { ValidationError } from 'class-validator';

import { ErrorCode } from '@apps/server/common/customExceptions/errorCode';
import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';

export class ValidationException extends BaseException {
  constructor(errors: ValidationError[]) {
    super({
      statusCode: 400,
      title: 'error',
      errorCode: ErrorCode.VALIDATION_ERROR,
      errorMessage: errors.map((error) => error.constraints),
      raw: new Error(JSON.stringify(errors)),
      errorType: ErrorTypeEnum.WARN,
    });
  }
}
