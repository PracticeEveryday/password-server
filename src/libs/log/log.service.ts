import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';

@Injectable()
export class LogService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger) {}

  public traceCaller(stackTrace: string, deepLevel: number) {
    let startPos = stackTrace.indexOf('\n', 5);

    while (deepLevel--) {
      startPos = stackTrace.indexOf('\n', startPos + 1);
      if (startPos < 0) {
        startPos = stackTrace.lastIndexOf('\n', stackTrace.length);
        break;
      }
    }

    let endPos = stackTrace.indexOf('\n', startPos + 1);
    if (endPos < 0) {
      endPos = stackTrace.length;
    }

    const line = stackTrace.substring(startPos + 1, endPos);

    const functionNameStart = line.indexOf('(');
    const functionName = line.substring(0, functionNameStart);

    const filePathEnd = line.indexOf(')');
    const filePath = line.substring(functionNameStart + 1, filePathEnd);

    startPos = Math.max(stackTrace.lastIndexOf(' ', endPos), stackTrace.lastIndexOf('/', endPos));
    endPos = stackTrace.lastIndexOf(':', endPos);
    const location = stackTrace.substring(startPos + 1, endPos);

    return `📝 파일이름: ${location}, ${functionName.trim()}() \n 🐈 파일경로: ${filePath}`;
  }

  debug(label: string, message: string, data: unknown = {}): void {
    if (typeof data === 'object') {
      this.logger.debug({ message, ...data }, label);
    } else {
      this.logger.debug({ message, data }, label);
    }
  }

  info(label: string, message: string, data: unknown = {}): void {
    if (typeof data === 'object') {
      this.logger.log(`label: ${label}, message: ${message}: ${JSON.stringify({ message, ...data }, null, 2)}`);
    } else {
      this.logger.log(`label: ${label}, message: ${message}: ${JSON.stringify({ message, data }, null, 2)}`);
    }
  }

  errorLog(label: string, message: string, data: unknown = {}): void {
    if (typeof data === 'object') {
      this.logger.error({ message, ...data }, label);
    } else {
      this.logger.error({ message, data }, label);
    }
  }

  warn(error: BaseException, requestInfo): void {
    this.logger.warn(
      `요청 정보: ${JSON.stringify(requestInfo, null, 2)}\n ${this.traceCaller(
        error.stack,
        0,
      )},\n ⌛ 실패시간: ${new Date().toISOString()}, `.trim(),
    );
  }

  error(label: string, error: BaseException): void {
    this.logger.error(`label: ${label}: ${JSON.stringify(error, null, 2)}`, JSON.stringify(error.raw, null, 2));
  }
}
