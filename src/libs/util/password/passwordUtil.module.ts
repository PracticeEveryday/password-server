import { Module } from '@nestjs/common';

import { PasswordUtilService } from './passwordUtil.service';

import { EnvModule } from '../../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [PasswordUtilService],
  exports: [PasswordUtilService],
})
export class PasswordUtilModule {}
