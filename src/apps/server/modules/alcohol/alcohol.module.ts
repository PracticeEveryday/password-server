import { Module } from '@nestjs/common';

import { AlcoholController } from '@apps/server/modules/alcohol/alcohol.controller';
import { AlcoholService } from '@apps/server/modules/alcohol/alcohol.service';
import { alcoholProviders } from '@apps/server/modules/alcohol/provider/alcohol.provider';
import { MysqlModule } from '@libs/adapter/db/mysql/mysql.module';

@Module({
  imports: [MysqlModule],
  controllers: [AlcoholController],
  providers: [AlcoholService, ...alcoholProviders],
})
export class AlcoholModule {}
