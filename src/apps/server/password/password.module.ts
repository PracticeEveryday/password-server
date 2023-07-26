import { Module } from '@nestjs/common';

import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { passwordProviders } from './providers/password.provider';
import { LogModule } from '../../../libs/log/log.module';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { PasswordUtilModule } from '../../../libs/utils/password-util/passwordUtil.module';
import { ValidateUtilModule } from '../../../libs/utils/validate-util/validateUtil.module';

@Module({
  imports: [PasswordUtilModule, MysqlModule, ValidateUtilModule, LogModule],
  controllers: [PasswordController],
  providers: [PasswordService, ...passwordProviders],
})
export class PasswordModule {}
