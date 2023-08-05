import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class CustomBadRequestException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      title: properties.title,
      message: properties.message,
      errorType: ErrorTypeEnum.WARN,
      raw: properties?.raw,
    });
  }
}
