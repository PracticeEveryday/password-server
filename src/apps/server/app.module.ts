import { ClassProvider, ClassSerializerInterceptor, ExecutionContext, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from '../../libs/env/env.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomExceptionFilter } from './common/filter/http-exception.filter';
import { LogModule } from '../../libs/log/log.module';
import { LogInterceptor } from './common/interceptor/logger.interceptor';
import { PasswordModule } from './password/password.module';
import { ReadlineModule } from '../../libs/readline/readline.module';
import { MysqlModule } from '../../libs/mysql/mysql.module';
import { HttpResponseInterceptor } from './common/interceptor/http-interceptor.interceptor';

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
