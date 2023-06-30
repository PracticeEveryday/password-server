import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class NotFoundException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      title: properties.title,
      message: properties.message,
      raw: properties?.raw,
    });
  }
}
