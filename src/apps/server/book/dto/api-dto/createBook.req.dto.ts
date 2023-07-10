import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmptyNumber } from '../../../common/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString } from '../../../common/decorator/validation/isCustomString.decorator';
import { BookDto } from '../../../common/dto/book.dto';

export class CreateBookReqDto extends PickType(BookDto, ['title', 'price']) {
  @IsNotEmptyString(0, 50)
  @ApiProperty({ example: '조영호', description: '책 저자 정보입니다.' })
  author: string;

  @IsNotEmptyNumber(0, 50)
  @ApiProperty({ example: '위키북스', description: '책 출판 정보입니다.' })
  publisher: string;

  @IsNotEmptyNumber(0)
  @ApiProperty({ example: 255, description: '전체 페이지 정보입니다.' })
  pageCount: number;
}
