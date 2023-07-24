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
