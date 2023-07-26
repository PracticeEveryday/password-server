import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmptyNumber } from '../decorator/validation/isCustomNumber.decorator';

export class FindOneByIdReqDto {
  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 1, description: '테이블의 기본키(id) 값입니다.' })
  id: number;
  static toDTO(id: number) {
    const findOneByIdDto = new FindOneByIdReqDto();
    findOneByIdDto.id = id;

    return findOneByIdDto;
  }
}
