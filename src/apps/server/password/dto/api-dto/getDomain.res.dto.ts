import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDomainResDto {
  @Exclude() private readonly _password: string;

  constructor(password: string) {
    this._password = password;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345678a', description: '도메인의 비밀번호입니다.' })
  get password(): string {
    return this._password;
  }
}

export class GetDomainResDtoNotFoundExceptionResDto {
  @ApiProperty({ example: 404 })
  statusCode: number;
  @ApiProperty({ example: 'not found domain' })
  title: string;
  @ApiProperty({ example: '해당 도메인의 비밀번호 데이터가 없습니다' })
  message: string;
}
