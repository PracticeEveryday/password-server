import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

import { IsOptionalNumber } from '@apps/server/common/decorator/validation/isCustomNumber.decorator';
import { toPage, toSize } from '@apps/server/common/helper/pagination.helper';

export class PaginationQueryDto {
  @Transform(({ value }) => toPage(value, { default: 1 }))
  @ApiPropertyOptional({
    name: 'pageNo',
    description: '조회하고자 하는 페이지 (기본값: 1)',
    example: 1,
  })
  @IsOptionalNumber(0)
  public pageNo: number;

  @Transform(({ value }) => toSize(value, { default: 10 }))
  @ApiPropertyOptional({
    name: 'pageSize',
    description: '불러올 아이템 갯수 (기본값: 10)',
    example: 10,
  })
  @IsOptionalNumber(0)
  public pageSize: number;
}

export class PaginationResDto {
  @Exclude() _pageNo;

  @Exclude() _pageSize;

  @Exclude() _totalCount;

  @Exclude() _totalPage;

  constructor(paginationInfo: { pageNo: number; pageSize: number; totalCount: number; totalPage: number }) {
    this._pageNo = paginationInfo.pageNo;
    this._pageSize = paginationInfo.pageSize;
    this._totalCount = paginationInfo.totalCount;
    this._totalPage = paginationInfo.totalPage;
  }

  @Expose()
  @ApiProperty({ description: '조회하고자 하는 페이지', example: 1 })
  get pageNo() {
    return this._pageNo;
  }

  @Expose()
  @ApiProperty({ description: '불러올 아이템 갯수', example: 10 })
  get pageSize() {
    return this._pageSize;
  }

  @Expose()
  @ApiProperty({ description: '총 아이템 갯수', example: 1 })
  get totalCount() {
    return this._totalCount;
  }

  @Expose()
  @ApiProperty({ description: '총 페이지 수', example: 1 })
  get totalPage() {
    return this._totalPage;
  }
}

export class Pagination {
  @ApiProperty({ example: 200 })
  statusCode?: number;

  @ApiProperty({ type: PaginationResDto })
  pagination: PaginationResDto;

  @ApiProperty({ type: Object })
  additional?: NonNullable<unknown>;
}
