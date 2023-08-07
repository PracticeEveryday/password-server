import { Exclude, Expose } from 'class-transformer';
import { validate } from 'class-validator';

import { ErrorCode } from '@apps/server/common/customExceptions/errorCode';
import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';
import { CustomBadRequestException } from '@apps/server/common/customExceptions/exception/badRequest.exception';
import { ValidationException } from '@apps/server/common/customExceptions/exception/validation.exception';
import { makeExceptionScript } from '@apps/server/common/customExceptions/makeExceptionScript';

export class ResponseDto<T> {
  @Exclude() private readonly _data: T;

  @Exclude() private readonly _message?: string;

  constructor(data: T, message?: string) {
    this._data = data;
    this._message = message;
  }

  static async OK_DATA_WITH_OPTIONAL_MESSAGE<T>(data: T, message?: string): Promise<ResponseDto<T>> {
    if (typeof data !== 'object') {
      throw new CustomBadRequestException(
        makeExceptionScript('password 타입이 아닙니다.', ErrorCode.TYPE_ERROR, ErrorMessage.PASSWORD.AUTH_4001),
      );
    }
    const errors = await validate(data);

    if (errors.length > 0) throw new ValidationException(errors);

    return new ResponseDto<T>(data, message);
  }

  @Expose()
  get message(): string | undefined {
    return this._message;
  }

  @Expose()
  get data(): T {
    return this._data;
  }
}
