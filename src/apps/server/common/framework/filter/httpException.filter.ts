import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { UnknownException } from '@commons/exception/exception/unknown.exception';
import { ErrorLogDto } from '@commons/type/dto/basicApiDto/errorLog.dto';
import { WarnLogDto } from '@commons/type/dto/basicApiDto/warnLog.dto';
import { ErrorTypeEnum } from '@commons/variable/enum/errorType.enum';
import { LogService } from '@libs/log/log.service';
import { SlackService } from '@libs/slack/slack.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    // httpAdapter를 context 외부에서 사용하기 위해 주입합니다.
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logService: LogService,
    private readonly slackService: SlackService,
  ) {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const exception = (() => {
      if (error instanceof BaseException) {
        return error;
      }

      if (error instanceof HttpException) {
        return new BaseException({
          message: error.message,
          statusCode: error.getStatus(),
          errorResponse: ErrorResponse.COMMON.INTERNAL_SERVER_ERROR,
          errorType: ErrorTypeEnum.ERROR,
          raw: error.stack,
        });
      }

      throw new UnknownException(ErrorResponse.COMMON.INTERNAL_SERVER_ERROR, error.stack, error.message);
    })();

    if (exception.errorType === ErrorTypeEnum.WARN) {
      const failLogDto = new WarnLogDto(exception, {
        method: request.method,
        url: request.url,
        body: request.body || null,
        headers: request.headers,
      });

      this.logService.warn(failLogDto);
      this.slackService.sendWarnToSlack(failLogDto);
    } else {
      const errorLogDto = new ErrorLogDto(exception, {
        method: request.method,
        url: request.url,
        body: request.body || null,
        headers: request.headers,
      });

      this.logService.error(errorLogDto);
      this.slackService.sendErrorToSlack(errorLogDto);
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
