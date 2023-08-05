import { Module } from '@nestjs/common';

import { AlcoholController } from '@apps/server/alcohol/alcohol.controller';
import { AlcoholService } from '@apps/server/alcohol/alcohol.service';
import { alcoholProviders } from '@apps/server/alcohol/provider/alcohol.provider';
import { MysqlModule } from '@libs/mysql/mysql.module';
import { SqlUtilModule } from '@libs/util/sql/sqlUtil.module';

@Module({
  imports: [MysqlModule, SqlUtilModule],
  controllers: [AlcoholController],
  providers: [AlcoholService, ...alcoholProviders],
})
export class AlcoholModule {}
