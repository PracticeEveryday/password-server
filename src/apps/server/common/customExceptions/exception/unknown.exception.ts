import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';
import ErrorResponse from '@commons/customExceptions/errorResponse';

export class UnknownException extends BaseException {
  constructor(errorResponse: ErrorResponse, raw?: unknown) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorResponse,
      errorType: ErrorTypeEnum.ERROR,
      raw,
    });
  }
}
