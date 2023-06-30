import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseException } from '../customExceptions/base.exception';
import { UnknownException } from '../customExceptions/unknown.exception';
import { LogService } from '../../../../libs/log/log.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    // httpAdapter를 context 외부에서 사용하기 위해 주입합니다.
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logService: LogService,
  ) {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const exception = (() => {
      if (error instanceof BaseException) {
        return error;
      }

      if (error instanceof HttpException) {
        return new BaseException({
          statusCode: error.getStatus(),
          title: error.name,
          message: error.message,
          raw: error,
        });
      }

      return new UnknownException({
        title: error.name,
        message: error.message,
        raw: error,
      });
    })();

    this.logService.error(CustomExceptionFilter.name, exception);

    //httpAdapter는 Host로 래핑되어 있어 실제 httpAdapter를 쓰기위해선 httpAdapterHost.httpAdapter를 사용하시면 됩니다.
    this.httpAdapterHost.httpAdapter.reply(ctx.getResponse(), exception.getResponse(), exception.getStatus());
  }
}
