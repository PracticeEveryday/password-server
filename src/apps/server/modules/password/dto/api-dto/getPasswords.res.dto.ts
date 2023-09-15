import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { PasswordDomain } from '@apps/server/modules/password/domain/password.domain';
import { IsNotEmptyDate, IsOptionalDate } from '@commons/framework/decorator/validation/isCustomDate.decorator';
import { IsNotEmptyNumber } from '@commons/framework/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString } from '@commons/framework/decorator/validation/isCustomString.decorator';
import { PaginationResDto } from '@commons/type/dto/piginationDto/pagination.res.dto';

export class PasswordResDto {
  @Exclude() _id: number;
  @Exclude() _domain: string;
  @Exclude() _password: string;
  @Exclude() _createdAt: Date;
  @Exclude() _updatedAt: Date;
  @Exclude() _deletedAt: Date | null;

  constructor(password: PasswordDomain) {
    this._id = password.id;
    this._domain = password.domain;
    this._password = password.password;
    this._createdAt = password.createdAt;
    this._updatedAt = password.updatedAt;
    this._deletedAt = password.deletedAt;
  }

  @IsNotEmptyNumber('id', 0)
  @ApiProperty({ example: 1, description: '비밀번호 id입니다.' })
  get id(): number {
    return this._id;
  }

  @IsNotEmptyString('domain', 100)
  @ApiProperty({ example: 'naver', description: '비밀번호 도메인입니다.' })
  get domain(): string {
    return this._domain;
  }

  @IsNotEmptyString('password', 150)
  @ApiProperty({ example: 'U2FsdGVkX1+U/pJ5iJEzYVXUT4PBEktG7FwpJFHa84Q=', description: '해쉬된 비밀번호입니다.' })
  get password(): string {
    return this._password;
  }

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-06T00:28:39.000Z', description: 'password가 생성된 날짜입니다.' })
  get createdAt(): Date {
    return this._createdAt;
  }

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-06T00:28:39.000Z', description: 'password가 업데이트된 날짜입니다.' })
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @IsOptionalDate()
  @ApiPropertyOptional({ example: null, description: 'password가 삭제된 날짜입니다.' })
  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}

export class GetPasswordsResDto extends PaginationResDto {
  @Exclude() _passwords: PasswordResDto[];

  constructor(passwords: PasswordResDto[], paginationInfo: PaginationResDto) {
    super(paginationInfo);
    this._passwords = passwords;
  }

  @Expose()
  @ApiProperty({ type: PasswordResDto, isArray: true, description: '페이지네이션 조건에 맞는 비밀번호 배열입니다.' })
  get passwords(): PasswordResDto[] {
    return this._passwords;
  }
}
