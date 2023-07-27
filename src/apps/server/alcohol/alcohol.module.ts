import { Module } from '@nestjs/common';

import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';
import { alcoholProviders } from './providers/alcohol.provider';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { SqlUtilModule } from '../../../libs/utils/sql-util/sqlUtil.module';

@Module({
  imports: [MysqlModule, SqlUtilModule],
  controllers: [AlcoholController],
  providers: [AlcoholService, ...alcoholProviders],
})
export class AlcoholModule {}
