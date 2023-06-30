import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDomainReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'naver' })
  domain: string;
}
