import { Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { PasswordUtilModule } from '../../../libs/utils/password-util/password-util.module';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { passwordProviders } from './providers/password.provider';

@Module({
  imports: [PasswordUtilModule, MysqlModule],
  controllers: [PasswordController],
  providers: [PasswordService, ...passwordProviders],
})
export class PasswordModule {}
