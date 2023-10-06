import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { NotFoundException as CustomNotFoundException } from '@commons/exception/exception/notFound.exception';
import { UnknownException } from '@commons/exception/exception/unknown.exception';
import { RequestInfoInterface } from '@commons/type/interface/requestInfo.interface';
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
      if (error instanceof NotFoundException) {
        return new CustomNotFoundException(ErrorResponse.COMMON.NOT_FOUND_URL, error.stack);
      }

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

    const requestInfo: RequestInfoInterface = {
      method: request.method,
      url: request.url,
      body: request.body || null,
      headers: request.headers,
    };

    if (exception.errorType === ErrorTypeEnum.WARN) {
      this.logService.warn(requestInfo, exception.stack);
      this.slackService.sendWarnToSlack(exception.errorResponse);
    } else {
      this.logService.error(requestInfo, exception.raw);
      this.slackService.sendErrorToSlack(exception.errorResponse);
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
