import { PickType } from '@nestjs/swagger';
import { PasswordDto } from '../../../common/dto/password.dto';

export class CreatePassworeReqDto extends PickType(PasswordDto, ['password', 'domain']) {
  constructor(data: Pick<PasswordDto, 'password' | 'domain'>) {
    super();
    this.domain = data.domain;
    this.password = data.password;
  }

  public toEnity(data: Pick<PasswordDto, 'password' | 'domain'>) {
    this.domain = data.domain;
    this.password = data.password;

    return this;
  }
}
