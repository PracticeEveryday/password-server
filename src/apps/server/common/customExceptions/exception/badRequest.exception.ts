import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum, ExceptionPropertyType } from '@apps/server/common/enum/errorType.enum';

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
