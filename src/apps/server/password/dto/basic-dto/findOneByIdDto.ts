import { PickType } from '@nestjs/swagger';

import { PasswordDto } from '../../../common/dto/password.dto';

export class FindPasswordByIdDto extends PickType(PasswordDto, ['id']) {
  static toDTO(id: number) {
    const findOneByIdDto = new FindPasswordByIdDto();
    findOneByIdDto.id = id;

    return findOneByIdDto;
  }
}
