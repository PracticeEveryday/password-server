import { Injectable } from '@nestjs/common';

@Injectable()
export class SqlUtilService {
  public makeWhereEqualQuery<T extends NonNullable<unknown>>(where: T) {
    let whereQuery = '';
    let i = 0;
    for (const [key, value] of Object.entries(where)) {
      if (typeof key === 'number') {
        if (i > 0) {
          whereQuery = whereQuery + `AND ${key}=${value} `;
        } else {
          whereQuery = whereQuery + `${key}=${value} `;
        }
      } else {
        if (i > 0) {
          whereQuery = whereQuery + `AND ${key}='${value}' `;
        } else {
          whereQuery = whereQuery + `${key}='${value}' `;
        }
      }
      i++;
    }
    return whereQuery;
  }

  public makeWhereLikeQuery<T extends NonNullable<unknown>>(where: T) {
    let whereQuery = '';
    let i = 0;
    for (const [key, value] of Object.entries(where)) {
      typeof key === 'number'
        ? (whereQuery = whereQuery + `${key} LIKE %${value}% `)
        : (whereQuery = whereQuery + `${key} LIKE '%${value}%' `);

      i++;
    }
    return whereQuery;
  }
}
