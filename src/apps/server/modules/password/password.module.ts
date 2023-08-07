import { Module } from '@nestjs/common';

import { PasswordController } from '@apps/server/modules/password/password.controller';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { passwordProviders } from '@apps/server/modules/password/provider/password.provider';
import { LogModule } from '@libs/log/log.module';
import { MysqlModule } from '@libs/mysql/mysql.module';
import { PasswordUtilModule } from '@libs/util/password/passwordUtil.module';
import { ValidateUtilModule } from '@libs/util/validate/validateUtil.module';

@Module({
  controllers: [PasswordController],
  imports: [PasswordUtilModule, MysqlModule, ValidateUtilModule, LogModule],
  providers: [PasswordService, ...passwordProviders],
})
export class PasswordModule {}
