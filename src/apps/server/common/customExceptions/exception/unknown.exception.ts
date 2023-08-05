import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class CustomUnknownException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      title: properties.title,
      message: properties.message,
      errorType: ErrorTypeEnum.ERROR,
      raw: properties?.raw,
    });
  }
}
