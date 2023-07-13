import { Injectable } from '@nestjs/common';

import { StringUtilService } from '../string-util/string-util.service';

@Injectable()
export class SqlUtilService {
  constructor(private readonly stringUtilService: StringUtilService) {}
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
    for (const [key, value] of Object.entries(where)) {
      typeof key === 'number'
        ? (whereQuery = whereQuery + `${key} LIKE %${value}% `)
        : (whereQuery = whereQuery + `${key} LIKE '%${value}%' `);
    }
    return whereQuery;
  }

  public makeSelectQuery<T>(propertyArr: Array<keyof T>) {
    let selectQuery = '';

    propertyArr.forEach((property: keyof T, idx: number) => {
      if (idx === propertyArr.length - 1) {
        selectQuery = selectQuery + `${this.stringUtilService.parseCamelCaseToSnameCase(String(property))} AS ${String(property)}`;
        return;
      }
      selectQuery = selectQuery + `${this.stringUtilService.parseCamelCaseToSnameCase(String(property))} AS ${String(property)}, `;
    });

    return selectQuery;
  }
}
