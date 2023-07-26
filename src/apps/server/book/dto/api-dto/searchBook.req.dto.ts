import { ApiProperty } from '@nestjs/swagger';

import { IsBookWhereProperty } from '../../../common/decorator/validation/isBookWhereProperty.decorator';
import { IsNotEmptyString } from '../../../common/decorator/validation/isCustomString.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination';
import { BookWhereInterface } from '../../interface/book.interface';

export class SearchBookReqDto extends PaginationQueryDto {
  @IsNotEmptyString(0)
  @IsBookWhereProperty()
  @ApiProperty({ example: 'title', description: '어떤 컬럼으로 검색할지에 대한 조건입니다.' })
  search: string;

  @IsNotEmptyString(0)
  @ApiProperty({ example: '객체지향의 사실과 오해', description: '어떤 키워드로 검색할지에 대한 조건입니다.' })
  keyword: string;

  public makeWhereObj(): BookWhereInterface {
    const whereObj: BookWhereInterface = <BookWhereInterface>{};

    whereObj[this.search] = this.keyword;
    return whereObj;
  }
}
