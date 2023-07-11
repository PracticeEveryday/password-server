import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

import { MysqlService } from '../../../../libs/mysql/mysql.service';
import { BaseException } from '../customExceptions/exception/base.exception';
import { CustomUnknownException } from '../customExceptions/exception/unknown.exception';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly mysqlService: MysqlService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const connectionPool = await this.dbInit();

    req.connectionPool = connectionPool;

    return next.handle().pipe(
      catchError(async (error) => {
        await connectionPool.rollback();
        await connectionPool.release();

        if (error instanceof BaseException) {
          throw error;
        } else {
          throw new CustomUnknownException({ title: 'UnknownException', message: 'TransactionInterceptor', raw: error });
        }
      }),
      tap(async () => {
        await connectionPool.commit();
        await connectionPool.release();
      }),
    );
  }

  private async dbInit() {
    const cunnectionPool = await this.mysqlService.getConnectionPool();
    await cunnectionPool.connect();
    await cunnectionPool.beginTransaction();

    return cunnectionPool;
  }
}
