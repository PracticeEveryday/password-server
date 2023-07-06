import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';
import { ErrorTypeEnum } from '../enum/errorType.enum';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class ConflictException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.CONFLICT,
      title: properties.title,
      message: properties.message,
      errorType: ErrorTypeEnum.WARN,
      raw: properties?.raw,
    });
  }
}
