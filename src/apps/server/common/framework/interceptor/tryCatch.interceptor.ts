import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { UnknownException } from '@commons/exception/exception/unknown.exception';

@Injectable()
export class TryCatchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BaseException) {
          throw error;
        }

        throw new UnknownException({
          errorResponse: ErrorResponse.COMMON.INTERNAL_SERVER_ERROR,
          raw: error,
        });
      }),
    );
  }
}
