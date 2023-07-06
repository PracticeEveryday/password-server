import { PickType } from '@nestjs/swagger';

import { PasswordDto } from '../../../common/dto/password.dto';

export class CreatePasswordReqDto extends PickType(PasswordDto, ['password', 'domain']) {
  static toDTO(domain: string, password: string): CreatePasswordReqDto {
    const createPasswordReqDto = new CreatePasswordReqDto();
    createPasswordReqDto.domain = domain;
    createPasswordReqDto.password = password;

    return createPasswordReqDto;
  }
}
