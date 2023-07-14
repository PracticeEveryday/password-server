import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { BaseException } from '../customExceptions/exception/base.exception';
import { CustomUnknownException } from '../customExceptions/exception/unknown.exception';

@Injectable()
export class TryCatchInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    return next.handle().pipe(
      catchError(async (error) => {
        if (error instanceof BaseException) {
          throw error;
        } else {
          throw new CustomUnknownException({ title: 'UnknownException', message: error.message, raw: error });
        }
      }),
    );
  }
}
