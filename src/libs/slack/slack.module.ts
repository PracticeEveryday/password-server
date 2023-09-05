import { DynamicModule, Module } from '@nestjs/common';

import { ApiModule } from '@libs/api/api.module';
import { EnvModule } from '@libs/env/env.module';

import { SlackService } from './slack.service';

@Module({
  imports: [EnvModule, ApiModule],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: SlackModule,
    };
  }
}
