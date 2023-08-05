import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { BookInterface, BookMetaInterface } from '@apps/server/book/interface/book.interface';
import { IsNotEmptyDate, IsOptionalDate } from '@apps/server/common/decorator/validation/isCustomDate.decorator';
import { IsNotEmptyNumber } from '@apps/server/common/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString, IsOptionalString } from '@apps/server/common/decorator/validation/isCustomString.decorator';
import { BookSqlInterface } from '@libs/mysql/type/book.type';

export class BookMetaResDto {
  @Exclude() private readonly _id: number;

  @Exclude() private readonly _author: string;

  @Exclude() private readonly _publisher: string;

  @Exclude() private readonly _pageCount: number;

  constructor(data: Partial<BookSqlInterface>) {
    this._id = data.bookMetaId;
    this._author = data.bookMetaAuthor;
    this._publisher = data.bookMetaPublisher;
    this._pageCount = data.bookMetaPageCount;
  }

  static toDTO(data: Partial<BookSqlInterface>): BookMetaResDto {
    return new BookMetaResDto(data);
  }

  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 1, description: '책의 메타데이터 아이디입니다.' })
  get id(): number {
    return this._id;
  }

  @IsNotEmptyString(0)
  @ApiProperty({ example: '조용호', description: '책의 저자입니다.' })
  get author(): string {
    return this._author;
  }

  @ApiProperty({ example: '위키북스', description: '책의 출판사입니다.' })
  get publisher(): string {
    return this._publisher;
  }

  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 255, description: '책의 전체 페이지 수입니다.' })
  get pageCount(): number {
    return this._pageCount;
  }
}

export class FindOneByIdResDto {
  @Exclude() private readonly _id: number;

  @Exclude() private readonly _title: string;

  @Exclude() private readonly _price: number;

  @Exclude() private readonly _bookReport: string | null;

  @Exclude() private readonly _startDate: Date;

  @Exclude() private readonly _endDate: Date | null;

  @Exclude() private readonly _bookMeta: BookMetaInterface;

  constructor(data: BookInterface) {
    this._id = data.id;
    this._title = data.title;
    this._price = data.price;
    this._bookReport = data.bookReport;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._bookMeta = data.bookMeta;
  }

  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 1, description: '조회된 책의 아이디입니다.' })
  get id(): number {
    return this._id;
  }

  @IsNotEmptyString(0)
  @ApiProperty({ example: '객체 지향의 사실과 오해', description: '책의 제목입니다.' })
  get title(): string {
    return this._title;
  }

  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 20000, description: '책의 가격입니다.' })
  get price(): number {
    return this._price;
  }

  @IsOptionalString(0)
  @ApiProperty({ example: null, description: '책에 대한 독후감입니다.' })
  get bookReport(): string | null {
    return this._bookReport;
  }

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-10T00:18:37.000Z', description: '읽기 시작한 날짜입니다.' })
  get startDate(): Date {
    return this._startDate;
  }

  @IsOptionalDate()
  @ApiProperty({ example: null, description: '완독한 날짜입니다.' })
  get endDate(): Date | null {
    return this._endDate;
  }

  @Expose()
  @ApiProperty({ type: BookMetaResDto, description: '책의 메타정보입니다.' })
  get bookMeta() {
    return this._bookMeta;
  }
}
