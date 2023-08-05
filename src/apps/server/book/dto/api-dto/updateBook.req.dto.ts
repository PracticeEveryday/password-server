import { ApiProperty } from '@nestjs/swagger';
import { PoolConnection } from 'mysql2/promise';

import { BookInterface } from '@apps/server/book/interface/book.interface';
import { IsOptionalDate } from '@apps/server/common/decorator/validation/isCustomDate.decorator';
import { IsOptionalNumber } from '@apps/server/common/decorator/validation/isCustomNumber.decorator';
import { IsOptionalString } from '@apps/server/common/decorator/validation/isCustomString.decorator';

export class UpdateBookReqDto {
  @IsOptionalString(0, 50)
  @ApiProperty({ example: '조영호', description: '책 저자 정보입니다.' })
  author: string;

  @IsOptionalString(0, 50)
  @ApiProperty({ example: '위키북스', description: '책 출판 정보입니다.' })
  publisher: string;

  @IsOptionalNumber(0)
  @ApiProperty({ example: 255, description: '전체 페이지 정보입니다.' })
  pageCount: number;

  @IsOptionalString(0, 50)
  @ApiProperty({ example: '객체지향의 사실과 오해', description: '책 제목입니다.' })
  title: string;

  @IsOptionalNumber(0)
  @ApiProperty({ example: 20000, description: '책 가격입니다.' })
  price: number;

  @IsOptionalString(0, 1000)
  @ApiProperty({ example: '객체 지향을 오해하고 있었습니다.', description: '독후감입니다.' })
  bookReport: string | null;

  @IsOptionalDate()
  @ApiProperty({ example: '2023-06-15 00:00:00:000Z', description: '책을 읽기 시작한 날짜입니다.' })
  startDate: Date;

  @IsOptionalDate()
  @ApiProperty({ example: '2023-07-10 00:00:00:000Z', description: '책을 다 읽은 날짜입니다.' })
  endDate: Date | null;

  // 로직을 진행하다가 추가되는 프로퍼티들
  private _connectionPool?: PoolConnection;

  set setConnectionPool(connectionPool: PoolConnection) {
    this._connectionPool = connectionPool;
  }

  get connectionPool(): PoolConnection {
    return this._connectionPool;
  }

  public compareValue(book: Partial<BookInterface>): UpdateBookReqDto {
    if (!this.title) this.title = book.title;
    if (!this.price) this.price = book.price;
    if (!this.author) this.author = book.bookMeta.author;
    if (!this.publisher) this.publisher = book.bookMeta.publisher;
    if (!this.pageCount) this.pageCount = book.bookMeta.pageCount;
    if (!this.endDate) this.endDate = book.endDate;
    if (!this.startDate) this.startDate = book.startDate;

    return this;
  }

  static toDTO(data: {
    title: string;
    price: number;
    author: string;
    publisher: string;
    pageCount: number;
    startDate: Date;
    endDate: Date;
  }): UpdateBookReqDto {
    const updateBookReqDto = new UpdateBookReqDto();
    updateBookReqDto.title = data.title;
    updateBookReqDto.price = data.price;
    updateBookReqDto.author = data.author;
    updateBookReqDto.publisher = data.publisher;
    updateBookReqDto.pageCount = data.pageCount;
    updateBookReqDto.startDate = data.startDate;
    updateBookReqDto.endDate = data.endDate;

    return updateBookReqDto;
  }
}
