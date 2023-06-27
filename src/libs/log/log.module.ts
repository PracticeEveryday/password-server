import { DynamicModule, Module } from '@nestjs/common';
import { LogService } from './log.service';

@Module({
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
