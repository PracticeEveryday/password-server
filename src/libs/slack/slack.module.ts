import { DynamicModule, Module } from '@nestjs/common';

import { EnvModule } from '@libs/env/env.module';

import { SlackService } from './slack.service';

@Module({
  imports: [EnvModule],
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
