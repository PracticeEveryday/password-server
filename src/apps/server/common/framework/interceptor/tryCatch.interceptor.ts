import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import ErrorResponse from '@commons/exception/errorResponse';
import { BadRequestException } from '@commons/exception/exception';
import { BaseException } from '@commons/exception/exception/base.exception';
import { UnknownException } from '@commons/exception/exception/unknown.exception';

@Injectable()
export class TryCatchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);
        if (error instanceof BaseException) {
          throw error;
        }
        if (error instanceof TypeError) {
          throw new BadRequestException(ErrorResponse.TYPE.TYPE_ERROR(error.message), error.stack);
        }
        throw new UnknownException(ErrorResponse.COMMON.INTERNAL_SERVER_ERROR, error.stack, error.message);
      }),
    );
  }
}
