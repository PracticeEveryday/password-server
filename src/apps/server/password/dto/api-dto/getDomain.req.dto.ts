import { PickType } from '@nestjs/swagger';
import { PasswordDto } from '../../../common/dto/password.dto';

export class GetDomainQueryReqDto extends PickType(PasswordDto, ['domain']) {
  constructor(domain: string) {
    super();
    this.domain = domain;
  }
  public toEnity(data: Pick<PasswordDto, 'domain'>) {
    this.domain = data.domain;

    return this;
  }
}
