import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from '../../libs/env/env.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from '../common/filter/http-exception.filter';

const filter = {
  provide: APP_FILTER,
  useClass: CustomExceptionFilter,
};

@Module({
  imports: [EnvModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, filter],
})
export class AppModule {}
