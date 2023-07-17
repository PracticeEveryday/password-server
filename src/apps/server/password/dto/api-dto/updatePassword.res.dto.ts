import { Exclude } from 'class-transformer';

import { IsNotEmptyBoolean } from '../../../common/decorator/validation/isCustomBoolean.decorator';

export class UpdatePasswordResDto {
  @Exclude() _isUpdated: boolean;

  constructor(isUpdated: boolean) {
    this._isUpdated = isUpdated;
  }

  @IsNotEmptyBoolean()
  get isUpdated(): boolean {
    return this._isUpdated;
  }
}
