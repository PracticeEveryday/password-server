import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsOptionalNumber } from '@commons/decorator/validation/isCustomNumber.decorator';
import { toPage, toSize } from '@commons/helper/pagination.helper';

export class PaginationQueryDto {
  @Transform(({ value }) => toPage(value, { default: 1 }))
  @ApiPropertyOptional({
    name: 'pageNo',
    description: '조회하고자 하는 페이지 (기본값: 1)',
    example: 1,
  })
  @IsOptionalNumber('pageNo', 0)
  public pageNo: number;

  @Transform(({ value }) => toSize(value, { default: 10 }))
  @ApiPropertyOptional({
    name: 'pageSize',
    description: '불러올 아이템 갯수 (기본값: 10)',
    example: 10,
  })
  @IsOptionalNumber('pageSize', 0)
  public pageSize: number;
}
