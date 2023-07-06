import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePasswordResDto {
  @Exclude() private readonly _domain: string;

  constructor(domain: string) {
    this._domain = domain;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'naver', description: '비밀번호를 저장할 도메인 정보입니다.' })
  get domain(): string {
    return this._domain;
  }
}
