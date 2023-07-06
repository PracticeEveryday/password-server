import { IsNotEmptyNumber } from '../decorator/validation/isCustomNumber.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmptyString } from '../decorator/validation/isCustomString.decorator';
import { IsNotEmptyDate, IsOptionalDate } from '../decorator/validation/isCustomDate.decorator';

export class PasswordDto {
  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 1, description: 'password Id입니다.' })
  id: number;

  @IsNotEmptyString(0, 100)
  @ApiProperty({ example: 'naver', description: '비밀번호 도메인 정보입니다.' })
  domain: string;

  @IsNotEmptyString(0, 150)
  @ApiProperty({ example: '123456789a', description: '비밀번호 도메인 정보입니다.' })
  password: string;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: 'password 생성 날짜입니다.' })
  createdAt: Date;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: 'password 수정 날짜입니다.' })
  updatedAt: Date;

  @IsOptionalDate()
  @ApiPropertyOptional({ example: '2023-07-05 09:12:05:000Z', description: 'password 삭제 날짜입니다.' })
  deletedAt: Date | null;
}
