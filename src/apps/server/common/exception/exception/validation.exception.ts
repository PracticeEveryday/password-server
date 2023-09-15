import { ValidationError } from 'class-validator';

import { BaseException } from '@commons/exception/exception/base.exception';
import { ErrorTypeEnum } from '@commons/variable/enum/errorType.enum';

export class ValidationException extends BaseException {
  constructor(errors: ValidationError[]) {
    super({
      statusCode: 400,
      errorResponse: {
        code: 'VALIDATION_ERROR',
        ENG: 'VALIDATION_ERROR',
        KR: errors
          .map((error) => {
            const messageArr = Object.values(error.constraints);

            const formatted = messageArr.map((message, idx) => {
              if (messageArr.length === 1) {
                return messageArr;
              }

              if (idx === 0) {
                return message.replace('합니다.', '하며, ');
              }

              if (messageArr.length !== idx + 1) {
                return message.replace('합니다.', '하고,');
              }

              return message;
            });

            return formatted.join('');
          })
          .join(' '),
      },
      raw: new Error(JSON.stringify(errors)),
      errorType: ErrorTypeEnum.WARN,
    });
  }
}
