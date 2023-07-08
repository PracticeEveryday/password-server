import { PaginationResDto } from '../dto/pagination';

interface PaginationOptions {
  default: number;
}

export function toPage(value: string, options: PaginationOptions): number {
  if (value) {
    const page = Number(value);
    return page > 0 ? page : options.default;
  }
  return options.default;
}

export function toSize(value: string, options: PaginationOptions): number {
  if (value) {
    const size = Number(value);
    return size > 0 ? size : options.default;
  }
  return options.default;
}

export function toPagination(totalCount: number, page: number, size: number): PaginationResDto {
  return new PaginationResDto({ totalCount, totalPage: Math.ceil(totalCount / size), pageNo: page, pageSize: size });
}
