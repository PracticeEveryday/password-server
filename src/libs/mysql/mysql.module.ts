import { Module } from '@nestjs/common';

import { MysqlService } from './mysql.service';

import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [MysqlService],
  exports: [MysqlService],
})
export class MysqlModule {}
