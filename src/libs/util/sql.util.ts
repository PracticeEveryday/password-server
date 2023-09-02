import { RowDataPacket } from 'mysql2';

export class SqlUtil {
  /**
   * equal 쿼리를 만들어주는 메서드
   * @param where where 조건으로 걸 제너릭 Object 타입
   */
  public static makeWhereEqualQuery<T extends NonNullable<unknown>>(where: T) {
    let whereQuery = '';
    let i = 0;
    for (const [key, value] of Object.entries(where)) {
      if (typeof key === 'number') {
        if (i > 0) {
          whereQuery = `${whereQuery}AND ${key}=${value} `;
        } else {
          whereQuery = `${whereQuery}${key}=${value} `;
        }
      } else {
        if (i > 0) {
          whereQuery = `${whereQuery}AND ${key}='${value}' `;
        } else {
          whereQuery = `${whereQuery}${key}='${value}' `;
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
  public static makeWhereLikeQuery<T extends NonNullable<unknown>>(where: T) {
    let whereQuery = '';
    for (const [key, value] of Object.entries(where)) {
      typeof key === 'number'
        ? (whereQuery = `${whereQuery}${key} LIKE %${value}% `)
        : (whereQuery = `${whereQuery}${key} LIKE '%${value}%' `);
    }
    return whereQuery;
  }

  public static checkTypeAndConvertObj<T extends object, U>(
    data: RowDataPacket,
    joinColumnArr: Array<Extract<keyof T, string>>,
    propertyFlag: keyof T,
  ): U {
    if (data.hasOwnProperty(propertyFlag)) {
      const sqlResult = data as Partial<T>;
      const convertObj = <U>{};
      const sliceConditionValue = <Partial<U>>{};

      for (const [key, value] of Object.entries(sqlResult)) {
        const sliceCondition = joinColumnArr.find((column) => {
          const regex = new RegExp(String(column));
          return regex.test(key);
        });

        if (sliceCondition) {
          const [, splitedValue] = key.split(sliceCondition);

          sliceConditionValue[splitedValue.replace(/^./, splitedValue[0].toLowerCase())] = value;
          convertObj[sliceCondition as string] = sliceConditionValue;
        } else {
          convertObj[key] = value;
        }
      }
      return convertObj;
    }
  }
}
