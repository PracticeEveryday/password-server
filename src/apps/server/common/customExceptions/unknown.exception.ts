import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';
import { ErrorTypeEnum } from '../enum/errorType.enum';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class UnknownException extends BaseException {
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
