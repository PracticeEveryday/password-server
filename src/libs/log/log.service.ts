import { Injectable, Logger } from '@nestjs/common';
import { BaseException } from '../../apps/server/common/customExceptions/base.exception';

@Injectable()
export class LogService {
  private readonly logger = new Logger();

  debug(label: string, message: string, data: any = {}): void {
    this.logger.debug({ message, ...data }, label);
  }

  info(label: string, message: string, data: any = {}): void {
    this.logger.log({ message, ...data }, label);
  }

  errorLog(label: string, message: string, data: any = {}): void {
    this.logger.error({ message, ...data }, label);
  }

  warn(label: string, error: BaseException): void {
    this.logger.warn(error.name, [error.message, error.stack, error.raw].join('\n'), label);
  }

  error(label: string, error: BaseException): void {
    this.logger.error(error.name, [error.message, error.stack, error.raw].join('\n'), label);
  }
}
