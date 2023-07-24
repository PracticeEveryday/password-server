import { ApiProperty } from '@nestjs/swagger';
import { PoolConnection } from 'mysql2/promise';

import { IsOptionalDate } from '../../../common/decorator/validation/isCustomDate.decorator';
import { IsOptionalNumber } from '../../../common/decorator/validation/isCustomNumber.decorator';
import { IsOptionalString } from '../../../common/decorator/validation/isCustomString.decorator';
import { BookInterface } from '../../interface/book.interface';

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
    if (this.title) book.title = this.title;
    if (this.price) book.price = this.price;
    if (this.author) book.bookMeta.author = this.author;
    if (this.publisher) book.bookMeta.publisher = this.publisher;
    if (this.pageCount) book.bookMeta.pageCount = this.pageCount;
    if (this.endDate) book.endDate = this.endDate;
    if (this.startDate) book.startDate = this.startDate;

    return this;
  }
}
