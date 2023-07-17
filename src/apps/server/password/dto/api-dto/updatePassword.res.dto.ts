import { Exclude, Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

import { IsNotEmptyBoolean } from '../../../common/decorator/validation/isCustomBoolean.decorator';

export class UpdatePasswordResDto {
  @Exclude() _isUpdated: boolean;

  constructor(isUpdated: boolean) {
    this._isUpdated = isUpdated;
  }

  @Expose()
  @IsNotEmptyBoolean()
  @IsBoolean()
  get isUpdated(): boolean {
    return this._isUpdated;
  }
}
