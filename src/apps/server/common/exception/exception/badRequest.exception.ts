import { HttpStatus } from '@nestjs/common';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { ErrorTypeEnum } from '@commons/variable/enum/errorType.enum';

export class BadRequestException extends BaseException {
  constructor(errorResponse: ErrorResponse, raw?: string) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      errorResponse,
      errorType: ErrorTypeEnum.WARN,
      raw,
    });
  }
}
