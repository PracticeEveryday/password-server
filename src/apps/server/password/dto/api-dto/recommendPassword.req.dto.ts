import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmptyNumber } from '../../../common/decorator/validation/isCustomNumber.decorator';

export class GetRecommendPasswordReqQueryDto {
  @IsNotEmptyNumber(0, 30)
  @ApiProperty({ example: 12, description: '반환 받고 싶은 비밀번호 길이' })
  passwordLength: number;
}
