import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';
export class ConflictException extends BaseException {
  constructor(properties: Pick<BaseException, ExceptionPropertyType>) {
    super({
      statusCode: HttpStatus.CONFLICT,
      title: properties.title,
      message: properties.message,
      raw: properties?.raw,
    });
  }
}
