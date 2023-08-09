import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { ErrorCode } from '@apps/server/common/customExceptions/errorCode';
import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';
import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { CustomUnknownException } from '@apps/server/common/customExceptions/exception/unknown.exception';

@Injectable()
export class TryCatchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BaseException) {
          throw error;
        } else {
          throw new CustomUnknownException({
            title: 'sql error',
            errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
            errorMessage: ErrorMessage.COMMON.INTERNAL_SERVER_ERROR,
            raw: error,
          });
        }
      }),
    );
  }
}
