import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { IsNotEmptyNumber } from '@commons/framework/decorator/validation/isCustomNumber.decorator';

export class CreateBookResDto {
  @Exclude() _bookId: number;

  @Exclude() _bookMetaId: number;

  constructor(bookId: number, bookMetaId: number) {
    this._bookId = bookId;
    this._bookMetaId = bookMetaId;
  }

  @IsNotEmptyNumber('bookId', 0)
  @ApiProperty({ example: 1, description: '생성된 책 ID입니다.' })
  get bookId(): number {
    return this._bookId;
  }

  @IsNotEmptyNumber('bookMetaId', 0)
  @ApiProperty({ example: 1, description: '생성된 책 메타 데이터 ID입니다.' })
  get bookMetaId(): number {
    return this._bookMetaId;
  }
}
