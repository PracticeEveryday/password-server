import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { IsNotEmptyBoolean } from '@commons/framework/decorator/validation/isCustomBoolean.decorator';

export class UpdatedResDto {
  @Exclude() _isUpdated: boolean;

  constructor(isUpdated: boolean) {
    this._isUpdated = isUpdated;
  }

  @Expose()
  @IsNotEmptyBoolean()
  @ApiProperty({ example: true, description: '업데이트가 제대로 되었는지 여부입니다.' })
  get isUpdated(): boolean {
    return this._isUpdated;
  }
}
