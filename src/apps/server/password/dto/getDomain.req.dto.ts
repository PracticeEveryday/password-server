import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDomainQueryReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'naver', description: '조회할 도메인' })
  domain: string;
}
