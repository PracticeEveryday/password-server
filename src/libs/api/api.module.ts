import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';

import { LogModule } from '@libs/log/log.module';

import { ApiService } from './api.service';

@Module({
  imports: [HttpModule.register({}), LogModule],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: ApiModule,
    };
  }
}
