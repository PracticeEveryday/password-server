/**
 * book에서 가능한 조건
 */
export interface BookWhereInterface {
  id?: number;
  title?: string;
  price?: number;
  bookReport?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * bookMeta 인터페이스
 */
export interface BookMetaInterface {
  id: number;
  bookId: number;
  author: string;
  publisher: string;
  pageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * book 인터페이스
 */
export interface BookInterface {
  id: number;
  title: string;
  price: number;
  bookReport?: string;
  startDate: Date;
  endDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  bookMeta: BookMetaInterface;
}
