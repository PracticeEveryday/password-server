import { Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { PasswordUtilModule } from '../../../libs/utils/password-util/password-util.module';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { passwordProviders } from './providers/password.provider';
import { ValidateUtilModule } from '../../../libs/utils/validate-util/validate-util.module';

@Module({
  imports: [PasswordUtilModule, MysqlModule, ValidateUtilModule],
  controllers: [PasswordController],
  providers: [PasswordService, ...passwordProviders],
})
export class PasswordModule {}
