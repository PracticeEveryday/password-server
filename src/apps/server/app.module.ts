import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from '../../libs/env/env.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomExceptionFilter } from './common/filter/http-exception.filter';
import { LogModule } from '../../libs/log/log.module';
import { LogInterceptor } from './common/interceptor/logger.interceptor';
import { PasswordModule } from './password/password.module';
import { ReadlineModule } from '../../libs/readline/readline.module';

const filter = {
  provide: APP_FILTER,
  useClass: CustomExceptionFilter,
};

const interceptor = {
  provide: APP_INTERCEPTOR,
  useClass: LogInterceptor,
};

@Module({
  imports: [EnvModule.forRoot(), LogModule.forRoot(), PasswordModule, ReadlineModule],
  controllers: [AppController],
  providers: [AppService, filter, interceptor],
})
export class AppModule {}
