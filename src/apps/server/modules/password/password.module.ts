import { Module } from '@nestjs/common';

import { PasswordServiceHelper } from '@apps/server/modules/password/helper/passwordService.helper';
import { PasswordController } from '@apps/server/modules/password/password.controller';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { passwordProviders } from '@apps/server/modules/password/provider/password.provider';
import { LogModule } from '@libs/log/log.module';
import { MysqlModule } from '@libs/mysql/mysql.module';

@Module({
  controllers: [PasswordController],
  imports: [MysqlModule, LogModule.forRoot()],
  providers: [PasswordService, PasswordServiceHelper, ...passwordProviders],
})
export class PasswordModule {}
