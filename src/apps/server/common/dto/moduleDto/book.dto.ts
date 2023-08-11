import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmptyDate, IsOptionalDate } from '@commons/decorator/validation/isCustomDate.decorator';
import { IsNotEmptyNumber } from '@commons/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString, IsOptionalString } from '@commons/decorator/validation/isCustomString.decorator';

export class BookMetaDto {
  @IsNotEmptyNumber('id', 0)
  @ApiProperty({ example: 1, description: 'bookMeta ID입니다.' })
  id: number;

  @IsNotEmptyNumber('bookId', 0)
  @ApiProperty({ example: 1, description: '연결된 book의 ID입니다.' })
  bookId: number;

  @IsNotEmptyString('author', 0, 50)
  @ApiProperty({ example: '조영호', description: '책 저자 정보입니다.' })
  author: string;

  @IsNotEmptyNumber('publisher', 0, 50)
  @ApiProperty({ example: '위키북스', description: '책 출판 정보입니다.' })
  publisher: string;

  @IsNotEmptyNumber('pageCount', 0)
  @ApiProperty({ example: 255, description: '전체 페이지 정보입니다.' })
  pageCount: number;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: '책 메타데이터 생성 날짜입니다.' })
  createdAt: Date;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: '책 메타데이터 수정 날짜입니다.' })
  updatedAt: Date;

  @IsOptionalDate()
  @ApiPropertyOptional({ example: '2023-07-10 00:00:00:000Z', description: '책 메타데이터 삭제 날짜입니다.' })
  deletedAt: Date | null;
}

export class BookDto {
  @IsNotEmptyNumber('id', 0)
  @ApiProperty({ example: 1, description: 'book ID입니다.' })
  id: number;

  @IsNotEmptyString('title', 0, 50)
  @ApiProperty({ example: '객체지향의 사실과 오해', description: '책 제목입니다.' })
  title: string;

  @IsNotEmptyNumber('price', 0)
  @ApiProperty({ example: 20000, description: '책 가격입니다.' })
  price: number;

  @IsOptionalString('bookReport', 0, 1000)
  @ApiProperty({ example: '객체 지향을 오해하고 있었습니다.', description: '독후감입니다.' })
  bookReport: string | null;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-06-15 00:00:00:000Z', description: '책을 읽기 시작한 날짜입니다.' })
  startDate: Date;

  @IsOptionalDate()
  @ApiProperty({ example: '2023-07-10 00:00:00:000Z', description: '책을 다 읽은 날짜입니다.' })
  endDate: Date | null;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: '책 생성 날짜입니다.' })
  createdAt: Date;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: '책 수정 날짜입니다.' })
  updatedAt: Date;

  @IsOptionalDate()
  @ApiPropertyOptional({ example: '2023-07-10 00:00:00:000Z', description: '책 삭제 날짜입니다.' })
  deletedAt: Date | null;

  @ApiProperty({ type: BookMetaDto, description: '책에 대한 메타데이터입니다.' })
  bookMeta: BookMetaDto;
}
