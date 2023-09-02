import { RowDataPacket } from 'mysql2';

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
export interface BookMetaInterface extends RowDataPacket {
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
export interface BookInterface extends RowDataPacket {
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
