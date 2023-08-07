import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ErrorCode } from '@apps/server/common/customExceptions/errorCode';
import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';
import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';

export class ValidationException extends BaseException {
  constructor(errors: ValidationError[]) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      title: '데이터 형식이 잘못되었습니다.',
      // message: errors
      //   .map(
      //     (error) =>
      //       `${error.property} / ${error.value} / ${Object.values(error.constraints)
      //         .map((value) => value)
      //         .join(',')}`,
      //   )
      //   .join('\n'),
      errorCode: ErrorCode.SUCCESS,
      errorMessage: ErrorMessage.COMMON.COMMON_0500,
      raw: new Error(JSON.stringify(errors)),
      errorType: ErrorTypeEnum.WARN,
    });
  }
}
