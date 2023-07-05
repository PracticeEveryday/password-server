import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassworeReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678a', description: '비밀번호' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'naver', description: '등록할 도메인' })
  domain: string;
}
