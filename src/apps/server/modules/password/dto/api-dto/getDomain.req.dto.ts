import { PickType } from '@nestjs/swagger';

import { PasswordDto } from '@commons/dto/moduleDto/password.dto';

export class GetDomainParamReqDto extends PickType(PasswordDto, ['domain']) {
  static toDTO(domain: string): GetDomainParamReqDto {
    const getDomainQueryReqDto = new GetDomainParamReqDto();
    getDomainQueryReqDto.domain = domain;

    return getDomainQueryReqDto;
  }
}
