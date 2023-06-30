import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePasswordResDto {
  @Exclude() private readonly _domain: string;

  constructor(domain: string) {
    this._domain = domain;
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'naver' })
  get domain() {
    return this._domain;
  }
}
