import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { IsNotEmptyBoolean } from '../../../common/decorator/validation/isCustomBoolean.decorator';

export class UpdatePasswordResDto {
  @Exclude() _isUpdated: boolean;

  constructor(isUpdated: boolean) {
    this._isUpdated = isUpdated;
  }

  @Expose()
  @IsNotEmptyBoolean()
  @ApiProperty({ example: true, description: '비밀번호가 업데이트 되었는지의 여부입니다.' })
  get isUpdated(): boolean {
    return this._isUpdated;
  }
}
