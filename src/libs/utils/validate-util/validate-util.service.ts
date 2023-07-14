import { Injectable } from '@nestjs/common';
import { QueryError, RowDataPacket } from 'mysql2';

import { BookSqlInterface } from '../../mysql/types/book.type';
import { PasswordInterface } from '../../mysql/types/password.type';

@Injectable()
export class ValidateUtilService {
  /**
   * PasswordInterface Type 유무 반환
   * @param args Arguments
   */
  public isPasswordInterfaceType = (args: unknown): args is PasswordInterface => {
    if (typeof args !== 'object' || args === null) {
      return false;
    }

    const { id, password, domain, createdAt, updatedAt, deletedAt } = args as PasswordInterface;

    return (
      typeof id === 'number' &&
      typeof password === 'string' &&
      typeof domain === 'string' &&
      createdAt instanceof Date &&
      updatedAt instanceof Date &&
      (deletedAt === null || deletedAt instanceof Date)
    );
  };

  /**
   * QueryError 유무 반환
   * @param args Arguments
   */
  public isQeuryErrorInterface = (args: unknown): args is QueryError => {
    if (typeof args !== 'object' || args === null) {
      return false;
    }

    const { code, sqlState, errno } = args as QueryError;

    return typeof code === 'string' && typeof sqlState === 'string' && typeof errno === 'number';
  };
}
