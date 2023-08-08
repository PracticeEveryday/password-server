import { ApiProperty } from '@nestjs/swagger';

import { IsBookWhereProperty } from '@apps/server/common/decorator/validation/isBookWhereProperty.decorator';
import { IsNotEmptyString } from '@apps/server/common/decorator/validation/isCustomString.decorator';
import { PaginationQueryDto } from '@apps/server/common/dto/pagination';
import { BookWhereInterface } from '@apps/server/modules/book/interface/book.interface';

export class SearchBookReqDto extends PaginationQueryDto {
  @IsNotEmptyString('search', 0)
  @IsBookWhereProperty()
  @ApiProperty({ example: 'title', description: '어떤 컬럼으로 검색할지에 대한 조건입니다.' })
  search: string;

  @IsNotEmptyString('keyword', 0)
  @ApiProperty({ example: '객체지향의 사실과 오해', description: '어떤 키워드로 검색할지에 대한 조건입니다.' })
  keyword: string;

  public makeWhereObj(): BookWhereInterface {
    const whereObj: BookWhereInterface = <BookWhereInterface>{};

    whereObj[this.search] = this.keyword;
    return whereObj;
  }
}
