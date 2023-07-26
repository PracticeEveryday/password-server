import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { IsNotEmptyBoolean } from '../../decorator/validation/isCustomBoolean.decorator';

export class DeletedResDto {
  @Exclude() _isDeleted: boolean;

  constructor(isDeleted: boolean) {
    this._isDeleted = isDeleted;
  }

  @Expose()
  @IsNotEmptyBoolean()
  @ApiProperty({ example: true, description: '삭제가 제대로 되었는지 여부입니다.' })
  get isDeleted(): boolean {
    return this._isDeleted;
  }
}
