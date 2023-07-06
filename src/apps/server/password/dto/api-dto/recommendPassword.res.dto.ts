import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRecommendPasswordResDto {
  @Exclude() private readonly _recommendedPassword: string;

  constructor(recommendedPassword: string) {
    this._recommendedPassword = recommendedPassword;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '5kz#^j8U_r*kn', description: '무작위로 해싱된 비밀번호입니다.' })
  get recommendedPassword(): string {
    return this._recommendedPassword;
  }
}
