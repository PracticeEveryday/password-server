import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

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
          throw new CustomUnknownException({ title: 'UnknownException', raw: error });
        }
      }),
    );
  }
}
