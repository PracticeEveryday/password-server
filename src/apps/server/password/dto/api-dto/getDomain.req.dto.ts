import { PickType } from '@nestjs/swagger';

import { PasswordDto } from '../../../common/dto/password.dto';

export class GetDomainBodyReqDto extends PickType(PasswordDto, ['domain']) {
  static toDTO(domain: string): GetDomainBodyReqDto {
    const getDomainQueryReqDto = new GetDomainBodyReqDto();
    getDomainQueryReqDto.domain = domain;

    return getDomainQueryReqDto;
  }
}
