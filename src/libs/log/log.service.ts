import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import { RequestInfoInterface } from '@commons/type/interface/requestInfo.interface';

@Injectable()
export class LogService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger) {}

  public info(label: string, message: string, data: unknown = {}): void {
    if (typeof data === 'object') {
      this.logger.log(`label: ${label}, message: ${message}: ${JSON.stringify({ message, ...data }, null, 2)}`);
    } else {
      this.logger.log(`label: ${label}, message: ${message}: ${JSON.stringify({ message, data }, null, 2)}`);
    }
  }

  public warn(requestInfo: RequestInfoInterface, raw: string): void {
    this.logger.warn(`${this.formatRequestInformation(requestInfo)} ${this.traceCaller(raw, 0)},\n ${this.getFailTime()}, `.trim());
  }

  public error(requestInfo: RequestInfoInterface, raw: string): void {
    this.logger.error(`${this.formatRequestInformation(requestInfo)} ${this.traceCaller(raw, 0)},\n ${this.getFailTime()}, `.trim());
  }

  /**
   * 에러 메시지 출력
   * @param message 에러 메시지
   * @param stack 에러 메시지가 생성된 raw
   */
  public errorMsg(message: string, stack: string): void {
    this.logger.error(`message: ${message},\n ${this.traceCaller(stack, 0)}`);
  }

  /**
   * 요청 정보 반환
   * @param requestInfo 요청 정보 Interface
   */
  private formatRequestInformation(requestInfo: RequestInfoInterface): string {
    return `📰 요청 정보: ${JSON.stringify(requestInfo, null, 2)}\n`;
  }

  /**
   *
   * 실패한 시간을 반환
   */
  private getFailTime(): string {
    return `⌛ 실패시간: ${new Date().toISOString()}`;
  }

  /**
   *
   * @param stackTrace 에러 스택
   * @param deepLevel 파일의 깊이
   */
  private traceCaller(stackTrace: string, deepLevel: number): string {
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
}
