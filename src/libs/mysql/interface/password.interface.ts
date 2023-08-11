import { RowDataPacket } from 'mysql2';

export interface PasswordSqlInterface extends RowDataPacket {
  id?: number;
  password: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
