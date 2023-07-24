import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { BookSqlInterface } from '../../../../../libs/mysql/types/book.type';
import { IsNotEmptyDate, IsOptionalDate } from '../../../common/decorator/validation/isCustomDate.decorator';
import { IsNotEmptyNumber } from '../../../common/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString, IsOptionalString } from '../../../common/decorator/validation/isCustomString.decorator';

export class FindOneByIdResDto {
  @Exclude() private readonly _bookId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _price: number;
  @Exclude() private readonly _bookReport: string | null;
  @Exclude() private readonly _startDate: Date;
  @Exclude() private readonly _endDate: Date | null;
  @Exclude() private readonly _bookMetaId: number;
  @Exclude() private readonly _bookMetaAuthor: string;
  @Exclude() private readonly _bookMetaPublisher: string;
  @Exclude() private readonly _bookMetaPageCount: number;

  constructor(data: Partial<BookSqlInterface>) {
    this._bookId = data.bookId;
    this._title = data.title;
    this._price = data.price;
    this._bookReport = data.bookReport;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._bookMetaId = data.bookMetaId;
    this._bookMetaAuthor = data.bookMetaAuthor;
    this._bookMetaPublisher = data.bookMetaPublisher;
    this._bookMetaPageCount = data.bookMetaPageCount;
  }

  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 1, description: '조회된 책의 아이디입니다.' })
  get bookId(): number {
    return this._bookId;
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
  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 1, description: '책의 메타데이터 아이디입니다.' })
  get bookMetaId(): number {
    return this._bookMetaId;
  }
  @IsNotEmptyString(0)
  @ApiProperty({ example: '조용호', description: '책의 저자입니다.' })
  get bookMetaAuthor(): string {
    return this._bookMetaAuthor;
  }
  @ApiProperty({ example: '위키북스', description: '책의 출판사입니다.' })
  get bookMetaPublisher(): string {
    return this._bookMetaPublisher;
  }
  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 255, description: '책의 전체 페이지 수입니다.' })
  get bookMetaPageCount(): number {
    return this._bookMetaPageCount;
  }
}
