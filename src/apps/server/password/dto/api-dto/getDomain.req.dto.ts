import { PickType } from '@nestjs/swagger';

import { PasswordDto } from '../../../common/dto/password.dto';

export class GetDomainQueryReqDto extends PickType(PasswordDto, ['domain']) {
  static toDTO(domain: string): GetDomainQueryReqDto {
    const getDomainQueryReqDto = new GetDomainQueryReqDto();
    getDomainQueryReqDto.domain = domain;

    return getDomainQueryReqDto;
  }
}
