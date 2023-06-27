import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class UnknownException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      title: properties.title,
      message: properties.message,
      raw: properties.raw,
    });
  }
}
