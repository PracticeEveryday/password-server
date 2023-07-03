import { IsInt, IsNotEmpty, IsNumber, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetRecommendPasswordReqQueryDto {
  @IsInt()
  @IsNotEmpty()
  @Max(30)
  @Type(() => Number)
  @ApiProperty({ example: 12, description: '반환 받고 싶은 비밀번호 길이' })
  passwordLength: number;
}
