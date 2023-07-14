import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { FindOneByIdResDto } from './findOneById.res.dto';

export class SearchBookResDto {
  @Exclude() _bookArr: FindOneByIdResDto[];

  constructor(bookArr: FindOneByIdResDto[]) {
    this._bookArr = bookArr;
  }

  @Expose()
  @ApiProperty({ type: FindOneByIdResDto, isArray: true, description: '검색한 책의 배열입니다.' })
  get bookArr(): FindOneByIdResDto[] {
    return this._bookArr;
  }
}
