import { ClassProvider, ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomExceptionFilter } from './common/filter/http-exception.filter';
import { HttpResponseInterceptor } from './common/interceptor/http-interceptor.interceptor';
import { LogInterceptor } from './common/interceptor/logger.interceptor';
import { PasswordModule } from './password/password.module';
import { EnvModule } from '../../libs/env/env.module';
import { LogModule } from '../../libs/log/log.module';
import { MysqlModule } from '../../libs/mysql/mysql.module';
import { ReadlineModule } from '../../libs/readline/readline.module';

const filter: ClassProvider[] = [
  {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  },
];

const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: HttpResponseInterceptor },
  {
    provide: APP_INTERCEPTOR,
    useClass: LogInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
];

@Module({
  imports: [EnvModule.forRoot(), LogModule.forRoot(), PasswordModule, ReadlineModule, MysqlModule],
  controllers: [AppController],
  providers: [AppService, ...filter, ...interceptors],
})
export class AppModule {}
