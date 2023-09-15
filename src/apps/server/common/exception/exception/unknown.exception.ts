import { HttpStatus } from '@nestjs/common';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { ErrorTypeEnum } from '@commons/variable/enum/errorType.enum';

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
