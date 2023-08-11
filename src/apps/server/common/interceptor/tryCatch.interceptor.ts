import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { UnknownException } from '@apps/server/common/customExceptions/exception/unknown.exception';

@Injectable()
export class TryCatchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BaseException) {
          throw error;
        } else {
          throw new UnknownException({
            errorResponse: ErrorResponse.COMMON.INTERNAL_SERVER_ERROR,
            raw: error,
          });
        }
      }),
    );
  }
}
