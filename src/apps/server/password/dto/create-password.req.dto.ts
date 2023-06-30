import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassworeReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678a' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'naver' })
  domain: string;
}
