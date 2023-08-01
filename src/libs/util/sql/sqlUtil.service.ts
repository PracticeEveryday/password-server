import { Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { StringUtilService } from '../string/stringUtil.service';

@Injectable()
export class SqlUtilService {
  constructor(private readonly stringUtilService: StringUtilService) {}

  /**
   * equal 쿼리를 만들어주는 메서드
   * @param where where 조건으로 걸 제너릭 Object 타입
   */
  public makeWhereEqualQuery<T extends NonNullable<unknown>>(where: T) {
    let whereQuery = '';
    let i = 0;
    for (const [key, value] of Object.entries(where)) {
      if (typeof key === 'number') {
        if (i > 0) {
          whereQuery = `${whereQuery  }AND ${key}=${value} `;
        } else {
          whereQuery = `${whereQuery  }${key}=${value} `;
        }
      } else {
        if (i > 0) {
          whereQuery = `${whereQuery  }AND ${key}='${value}' `;
        } else {
          whereQuery = `${whereQuery  }${key}='${value}' `;
        }
      }
      i++;
    }
    return whereQuery;
  }

  /**
   * Like 쿼리를 만들어주는 메서드
   * @param where 조건으로 걸 제너릭 Object 타입
   */
  public makeWhereLikeQuery<T extends NonNullable<unknown>>(where: T) {
    let whereQuery = '';
    for (const [key, value] of Object.entries(where)) {
      typeof key === 'number'
        ? (whereQuery = `${whereQuery  }${key} LIKE %${value}% `)
        : (whereQuery = `${whereQuery  }${key} LIKE '%${value}%' `);
    }
    return whereQuery;
  }

  /**
   * TODO: 쿼리 빌더를 만들어야 될 거 같음..ㅠㅠㅠ 너무 어렵다.
   * @param propertyArr 프로퍼티 keyword 이름 배열
   */
  public makeSelectQuery<T>(propertyArr: Array<keyof T>) {
    let selectQuery = '';

    propertyArr.forEach((property: keyof T, idx: number) => {
      if (idx === propertyArr.length - 1) {
        selectQuery = `${selectQuery  }${this.stringUtilService.parseCamelCaseToSnameCase(String(property))} AS ${String(property)}`;
        return;
      }
      selectQuery = `${selectQuery  }${this.stringUtilService.parseCamelCaseToSnameCase(String(property))} AS ${String(property)}, `;
    });

    return selectQuery;
  }

  public checkTypeAndConvertObj<T extends object, U>(
    data: RowDataPacket,
    bookJoinColumnArr: Array<Extract<keyof T, string>>,
    propertyFlag: keyof T,
  ): U {
    if (data.hasOwnProperty(propertyFlag)) {
      const bookSql = data as Partial<T>;
      const book = <U>{};
      const sliceConditionValue = <Partial<U>>{};

      for (const [key, value] of Object.entries(bookSql)) {
        const sliceCondition = bookJoinColumnArr.find((column) => {
          const regex = new RegExp(String(column));
          return regex.test(key);
        });

        if (sliceCondition) {
          const [, splitedValue] = key.split(sliceCondition);

          sliceConditionValue[splitedValue.replace(/^./, splitedValue[0].toLowerCase())] = value;
          book[sliceCondition as string] = sliceConditionValue;
        } else {
          book[key] = value;
        }
      }
      return book;
    }
  }
}
