import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';
import { CustomUnknownException } from '@apps/server/common/customExceptions/exception/unknown.exception';
import { ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';
import { LogService } from '@libs/log/log.service';

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
          errorType: ErrorTypeEnum.WARN,
          raw: error,
        });
      }

      return new CustomUnknownException({
        title: error.name,
        message: error.message,
        raw: error,
      });
    })();

    if (exception.errorType === ErrorTypeEnum.WARN) {
      this.logService.warn(CustomExceptionFilter.name, exception);
    } else {
      this.logService.error(CustomExceptionFilter.name, exception);
    }

    /**
     * httpAdapter는 Host로 래핑되어 있어 실제 httpAdapter를 쓰기위해선 httpAdapterHost.httpAdapter를 사용하시면 됩니다.
     * reply 함수 파라미터
     * @param http Response
     * @param error body type
     * @param statusCode
     */
    this.httpAdapterHost.httpAdapter.reply(ctx.getResponse(), exception.getResponse(), exception.getStatus());
  }
}
