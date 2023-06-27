import { Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { PasswordUtilModule } from '../../../libs/password-util/password-util.module';

@Module({
  imports: [PasswordUtilModule],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
