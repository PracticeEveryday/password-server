import { PaginationResponseDto } from '../dto/pagination';

interface PaginationOptions {
  default: number;
}

export function toPage(value: string, options: PaginationOptions): number {
  console.log(value);
  console.log(typeof value, 'vae');
  if (value) {
    const page = Number(value);
    return page > 0 ? page : options.default;
  }
  return options.default;
}

export function toSize(value: string, options: PaginationOptions): number {
  console.log(value, 2);
  if (value) {
    const size = Number(value);
    return size > 0 ? size : options.default;
  }
  return options.default;
}

export function toPagination(totalCount: number, page: number, size: number): PaginationResponseDto {
  return { totalCount, totalPage: Math.ceil(totalCount / size), page, size };
}
