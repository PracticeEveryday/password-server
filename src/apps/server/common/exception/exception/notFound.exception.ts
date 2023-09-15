import { HttpStatus } from '@nestjs/common';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { ErrorTypeEnum } from '@commons/variable/enum/errorType.enum';

export class NotFoundException extends BaseException {
  constructor(errorResponse: ErrorResponse, raw?: string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      errorResponse,
      errorType: ErrorTypeEnum.WARN,
      raw,
    });
  }
}
