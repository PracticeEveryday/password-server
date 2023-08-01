import { ClassProvider, ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AlcoholModule } from './alcohol/alcohol.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ValidationException } from './common/customExceptions/exception/validation.exception';
import { CustomExceptionFilter } from './common/filter/httpException.filter';
import { HttpResponseInterceptor } from './common/interceptor/http.interceptor';
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

const pipes = [
  {
    provide: APP_PIPE,
    useFactory: () => new ValidationPipe({
        transform: true, // 요청에서 넘어온 자료들의 형변환
        whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거
        forbidNonWhitelisted: true, // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러)
        exceptionFactory: (errors) => {
          throw new ValidationException(errors);
        },
      }),
  },
];
@Module({
  imports: [EnvModule.forRoot(), LogModule.forRoot(), PasswordModule, ReadlineModule, MysqlModule, BookModule, AlcoholModule],
  controllers: [AppController],
  providers: [AppService, ...filter, ...interceptors, ...pipes],
})
export class AppModule {}
