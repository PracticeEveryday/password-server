import { PickType } from '@nestjs/swagger';

import { PasswordDto } from '../../../common/dto/password.dto';

export class FindOneByIdDto extends PickType(PasswordDto, ['id']) {
  static toDTO(id: number) {
    const findOneByIdDto = new FindOneByIdDto();
    findOneByIdDto.id = id;

    return findOneByIdDto;
  }
}
