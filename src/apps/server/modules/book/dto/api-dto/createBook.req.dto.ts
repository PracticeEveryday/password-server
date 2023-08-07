import { ApiProperty, PickType } from '@nestjs/swagger';
import { PoolConnection } from 'mysql2/promise';

import { IsNotEmptyNumber } from '@apps/server/common/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString } from '@apps/server/common/decorator/validation/isCustomString.decorator';
import { BookDto } from '@apps/server/common/dto/book.dto';

export class CreateBookReqDto extends PickType(BookDto, ['title', 'price']) {
  @IsNotEmptyString(0, 50)
  @ApiProperty({ example: '조영호', description: '책 저자 정보입니다.' })
  author: string;

  @IsNotEmptyString(0, 50)
  @ApiProperty({ example: '위키북스', description: '책 출판 정보입니다.' })
  publisher: string;

  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 255, description: '전체 페이지 정보입니다.' })
  pageCount: number;

  // 로직을 진행하다가 추가되는 프로퍼티들
  private _bookId: number;

  private _connectionPool?: PoolConnection;

  set setBookId(id: number) {
    this._bookId = id;
  }

  set setConnectionPool(connectionPool: PoolConnection) {
    this._connectionPool = connectionPool;
  }

  get connectionPool(): PoolConnection {
    return this._connectionPool;
  }

  get bookId(): number {
    return this._bookId;
  }

  static toDTO(data: { title: string; price: number; author: string; publisher: string; pageCount: number }): CreateBookReqDto {
    const createBookReqDto = new CreateBookReqDto();
    createBookReqDto.title = data.title;
    createBookReqDto.price = data.price;
    createBookReqDto.author = data.author;
    createBookReqDto.publisher = data.publisher;
    createBookReqDto.pageCount = data.pageCount;

    return createBookReqDto;
  }
}
