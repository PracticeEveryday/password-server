import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import { BaseException } from '@apps/server/common/customExceptions/exception/base.exception';

@Injectable()
export class LogService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger) {}

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

  warn(label: string, error: BaseException): void {
    this.logger.warn(`label: ${label}: ${JSON.stringify(error.getResponse(), null, 2)}`);
  }

  error(label: string, error: BaseException): void {
    this.logger.error(`label: ${label}: ${JSON.stringify(error.getResponse(), null, 2)}`, JSON.stringify(error.raw));
  }
}
