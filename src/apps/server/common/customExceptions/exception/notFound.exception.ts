import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';
import { ErrorTypeEnum } from '../../enum/errorType.enum';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class CustomNotFoundException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      title: properties.title,
      message: properties.message,
      errorType: ErrorTypeEnum.WARN,
      raw: properties?.raw,
    });
  }
}
