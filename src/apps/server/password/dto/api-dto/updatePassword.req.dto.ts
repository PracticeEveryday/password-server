import { ApiProperty } from '@nestjs/swagger';

import { PasswordInterface } from '../../../../../libs/mysql/types/password.type';
import { IsNotEmptyBoolean, IsTrue } from '../../../common/decorator/validation/isCustomBoolean.decorator';
import { IsOptionalString } from '../../../common/decorator/validation/isCustomString.decorator';

export class UpdatePasswordReqDto {
  @IsOptionalString(0, 100)
  @ApiProperty({ example: 'naver', description: '비밀번호 도메인 정보입니다.' })
  domain: string;

  @IsOptionalString(0, 150)
  @ApiProperty({ example: '12345678a', description: '비밀번호 도메인 정보입니다.' })
  password: string;

  public compareValue(password: PasswordInterface): PasswordInterface {
    if (this.domain) password.domain = this.domain;
    if (this.password) password.password = this.password;

    return password;
  }
}
