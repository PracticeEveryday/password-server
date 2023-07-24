import { RowDataPacket } from 'mysql2';

export interface BookSqlInterface extends RowDataPacket {
  bookId: number;
  title: string;
  price: number;
  bookReport: string | null;
  startDate: Date;
  endDate: Date | null;
  bookMetaId: number;
  bookMetaAuthor: string;
  bookMetaPublisher: string;
  bookMetaPageCount: number;
}
