import { Module } from '@nestjs/common';

import { PasswordServiceHelper } from '@apps/server/modules/password/helper/passwordService.helper';
import { PasswordController } from '@apps/server/modules/password/password.controller';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { LogModule } from '@libs/log/log.module';
import { MysqlModule } from '@libs/mysql/mysql.module';
import { passwordProviders } from '@libs/mysql/provider/password.provider';

const databaseModule = MysqlModule;
@Module({
  controllers: [PasswordController],
  imports: [LogModule.forRoot(), databaseModule],
  providers: [PasswordService, PasswordServiceHelper, ...passwordProviders],
})
export class PasswordModule {}
