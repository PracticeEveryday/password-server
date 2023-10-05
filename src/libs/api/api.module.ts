import { DynamicModule, Module } from '@nestjs/common';

import { HttpModule } from '@libs/api/http.module';
import { LogModule } from '@libs/log/log.module';

import { ApiService } from './api.service';

@Module({
  imports: [HttpModule, LogModule],
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
