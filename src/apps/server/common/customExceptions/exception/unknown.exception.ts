import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum, ExceptionPropertyType } from '@apps/server/common/enum/errorType.enum';

export class CustomUnknownException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      title: properties.title,
      errorType: ErrorTypeEnum.ERROR,
      raw: properties?.raw,
    });
  }
}
