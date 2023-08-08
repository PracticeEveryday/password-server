import * as path from 'path';

import { DynamicModule, Module } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { LogService } from '@libs/log/log.service';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(process.cwd(), `./logs/${level}`),
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장,
    maxSize: '10mb',
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
      winston.format.printf((info) => `[${info['timestamp']}] ${info.level}: ${info.message}`),
    ),
  };
};

const winstonOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env['NODE_ENV'] === 'production' ? 'http' : 'silly',
      format: winston.format.combine(
        winston.format.timestamp(), // timestamp를 찍을거고
        winston.format.ms(), // ms 단위로 찍을거야

        nestWinstonModuleUtilities.format.nestLike('Integrated Login Server', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    // new winston.transports.DailyRotateFile(dailyOptions('info')),
    // new winston.transports.DailyRotateFile(dailyOptions('error')),
    // new winston.transports.DailyRotateFile(dailyOptions('warn')),
  ],
};
@Module({
  imports: [WinstonModule.forRoot(winstonOptions)],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: LogModule,
    };
  }
}
