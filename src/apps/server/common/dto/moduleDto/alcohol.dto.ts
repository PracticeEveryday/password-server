import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmptyDate, IsOptionalDate } from '@commons/decorator/validation/isCustomDate.decorator';
import { IsNotEmptyNumber } from '@commons/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString } from '@commons/decorator/validation/isCustomString.decorator';

export class AlcoholDto {
  @IsNotEmptyNumber('id', 0)
  @ApiProperty({ example: 1, description: 'alcohol Id입니다.' })
  id: number;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-27', description: '술 마신 날짜입니다.' })
  drinkingDate: Date;

  @IsNotEmptyString('relationship', 0, 50)
  @ApiProperty({ example: '친구', description: '함께 술 마신 사람과의 관계입니다.' })
  relationship: string;

  @IsNotEmptyString('mood', 0, 50)
  @ApiProperty({ example: '너무 신났다.', description: '술 마신 날의 종합적인 기분입니다.' })
  mood: string;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05', description: 'alcohol 생성 날짜입니다.' })
  createdAt: Date;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05', description: 'alcohol 수정 날짜입니다.' })
  updatedAt: Date;

  @IsOptionalDate()
  @ApiPropertyOptional({ example: '2023-07-05', description: 'alcohol 삭제 날짜입니다.' })
  deletedAt: Date | null;
}
