import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { IsNotEmptyBoolean } from '@apps/server/common/decorator/validation/isCustomBoolean.decorator';

export class CreateResDto {
  @Exclude() _isCreated: boolean;

  constructor(isCreated: boolean) {
    this._isCreated = isCreated;
  }

  @Expose()
  @IsNotEmptyBoolean()
  @ApiProperty({ example: true, description: '업데이트가 제대로 되었는지 여부입니다.' })
  get isCreated(): boolean {
    return this._isCreated;
  }
}
