import { PickType } from '@nestjs/swagger';

import { PasswordDto } from '../../../common/dto/password.dto';

export class FindOneByIdDto extends PickType(PasswordDto, ['id']) {
  constructor(id: number) {
    super();
    this.id = id;
  }
  public toEnity(data: Pick<PasswordDto, 'id'>) {
    this.id = data.id;

    return this;
  }
}
