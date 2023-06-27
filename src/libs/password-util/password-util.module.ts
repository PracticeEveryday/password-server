import { Module } from '@nestjs/common';
import { PasswordUtilService } from './password-util.service';

@Module({
  providers: [PasswordUtilService]
})
export class PasswordUtilModule {}
