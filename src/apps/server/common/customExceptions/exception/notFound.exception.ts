import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';
import ErrorResponse from '@commons/customExceptions/errorResponse';

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
