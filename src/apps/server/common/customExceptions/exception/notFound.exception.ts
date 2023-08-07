import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum, ExceptionPropertyType } from '@apps/server/common/enum/errorType.enum';

export class CustomNotFoundException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      title: properties.title,
      errorCode: properties.errorCode,
      errorMessage: properties.errorMessage,
      errorType: ErrorTypeEnum.WARN,
      raw: properties?.raw,
    });
  }
}
