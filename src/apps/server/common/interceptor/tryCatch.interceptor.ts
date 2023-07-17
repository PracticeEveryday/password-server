import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { BaseException } from '../customExceptions/exception/base.exception';
import { CustomUnknownException } from '../customExceptions/exception/unknown.exception';

@Injectable()
export class TryCatchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BaseException) {
          throw error;
        } else {
          throw new CustomUnknownException({ title: 'UnknownException', message: error.message, raw: error });
        }
      }),
    );
  }
}
