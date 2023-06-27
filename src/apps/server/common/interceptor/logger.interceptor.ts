import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { LogService } from '../../../../libs/log/log.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest() as Request;

    this.logService.info(LogInterceptor.name, 'Request', {
      headers: req.headers,
      query: req.query,
      params: req.params,
      ip: req.ip,
      body: req.body,
    });

    return next.handle().pipe(tap((response) => this.logService.info(LogInterceptor.name, `Response`, response)));
  }
}
