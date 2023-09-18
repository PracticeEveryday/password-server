import { Module } from '@nestjs/common';

import { PasswordController } from '@apps/server/modules/password/password.controller';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { MysqlModule } from '@libs/adapter/db/mysql/mysql.module';
import { passwordProviders } from '@libs/adapter/db/mysql/provider/password.provider';
import { LogModule } from '@libs/log/log.module';

const databaseModule = MysqlModule;
@Module({
  controllers: [PasswordController],
  imports: [LogModule.forRoot(), databaseModule],
  providers: [PasswordService, ...passwordProviders],
})
export class PasswordModule {}
