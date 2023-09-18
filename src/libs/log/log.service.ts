import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import { ErrorLogDto } from '@commons/type/dto/basicApiDto/errorLog.dto';
import { WarnLogDto } from '@commons/type/dto/basicApiDto/warnLog.dto';

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

  warn(failLogDto: WarnLogDto): void {
    this.logger.warn(
      `📰 요청 정보: ${JSON.stringify(failLogDto.requestInfo, null, 2)}\n ${this.traceCaller(
        failLogDto.exception.stack,
        0,
      )},\n ⌛ 실패시간: ${new Date().toISOString()}, `.trim(),
    );
  }

  error(errorLogDto: ErrorLogDto): void {
    this.logger.error(
      `📰 요청 정보: ${JSON.stringify(errorLogDto.requestInfo, null, 2)}\n ${this.traceCaller(
        errorLogDto.exception.raw,
        0,
      )},\n ⌛ 실패시간: ${new Date().toISOString()}, `.trim(),
    );
  }

  errorMsg(tag: string, message: string, stack: string): void {
    this.logger.error(`tag: ${tag}, message: ${message},\n ${this.traceCaller(stack, 0)}`);
  }
}
