import { ApiProperty } from '@nestjs/swagger';

import { IsOptionalString } from '@apps/server/common/decorator/validation/isCustomString.decorator';
import { PasswordSqlInterface } from '@libs/mysql/interface/password.interface';

export class UpdatePasswordReqDto {
  @IsOptionalString('domain', 0, 100)
  @ApiProperty({ example: 'naver', description: '비밀번호 도메인 정보입니다.' })
  domain: string;

  @IsOptionalString('password', 0, 150)
  @ApiProperty({ example: '12345678a', description: '비밀번호 도메인 정보입니다.' })
  password: string;

  public compareValue(password: PasswordSqlInterface): PasswordSqlInterface {
    if (this.domain) password.domain = this.domain;
    if (this.password) password.password = this.password;

    return password;
  }
}
