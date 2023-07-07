import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsOptionalNumber } from '../decorator/validation/isCustomNumber.decorator';
import { toPage, toSize } from '../helper/pagination.helper';

export class PaginationQueryDto {
  @Transform(({ value }) => toPage(value, { default: 1 }))
  @ApiPropertyOptional({
    name: 'page',
    description: '조회하고자 하는 페이지 (기본값: 1)',
    example: 1,
  })
  @IsOptionalNumber(0)
  public page: number;

  @Transform(({ value }) => toSize(value, { default: 10 }))
  @ApiPropertyOptional({
    name: 'size',
    description: '불러올 아이템 갯수 (기본값: 10)',
    example: 10,
  })
  @IsOptionalNumber(0)
  public size: number;
}

export class PaginationResponseDto {
  @ApiProperty({ description: '조회하고자 하는 페이지' })
  page = 1;
  @ApiProperty({ description: '불러올 아이템 갯수' })
  size = 10;
  @ApiProperty({ description: '총 아이템 갯수' })
  totalCount = 0;
  @ApiProperty({ description: '총 페이지 수' })
  totalPage = 1;
}

export class Pagination {
  @ApiProperty({ example: 200 })
  statusCode?: number;
  @ApiProperty({ type: PaginationResponseDto })
  pagination: PaginationResponseDto;
  @ApiProperty({ type: Object })
  additional?: NonNullable<unknown>;
}
