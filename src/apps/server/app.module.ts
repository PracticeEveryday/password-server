import { ClassProvider, ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppController } from '@apps/server/app.controller';
import { AppService } from '@apps/server/app.service';
import { ValidationException } from '@apps/server/common/customExceptions/exception/validation.exception';
import { CustomExceptionFilter } from '@apps/server/common/filter/httpException.filter';
import { HttpResponseInterceptor } from '@apps/server/common/interceptor/http.interceptor';
import { LogInterceptor } from '@apps/server/common/interceptor/logger.interceptor';
import { AlcoholModule } from '@apps/server/modules/alcohol/alcohol.module';
import { BookModule } from '@apps/server/modules/book/book.module';
import { PasswordModule } from '@apps/server/modules/password/password.module';
import { CorsMiddleware } from '@commons/middleware/cors.middleware';
import { ApiModule } from '@libs/api/api.module';
import { EnvModule } from '@libs/env/env.module';
import { LogModule } from '@libs/log/log.module';
import { MysqlModule } from '@libs/mysql/mysql.module';
import { ReadlineModule } from '@libs/readline/readline.module';
import { SlackModule } from '@libs/slack/slack.module';
import { TypeOrmDatabaseModule } from '@libs/typeorm/typeorm.module';

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
    useFactory: () =>
      new ValidationPipe({
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
  imports: [
    EnvModule.forRoot(),
    LogModule.forRoot(),
    SlackModule.forRoot(),
    ApiModule.forRoot(),
    PasswordModule,
    ReadlineModule,
    MysqlModule,
    //typeorm
    TypeOrmDatabaseModule,
    BookModule,
    AlcoholModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...filter, ...interceptors, ...pipes],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
