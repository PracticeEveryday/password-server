import { PickType } from '@nestjs/swagger';

import { BookDto } from '../../../common/dto/book.dto';

export class FindBookByIdDto extends PickType(BookDto, ['id']) {
  static toDTO(id: number) {
    const findOneByIdDto = new FindBookByIdDto();
    findOneByIdDto.id = id;

    return findOneByIdDto;
  }
}
