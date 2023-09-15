import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

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
