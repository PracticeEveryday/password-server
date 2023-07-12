import { registerDecorator } from 'class-validator';

import { BookWhereInterface } from '../../../book/interface/book.interface';

/**
 * BookInterface의 프로퍼티인지 여부 확인하는 데코레이터
 * @param validationOptions 유효성 검사할 Option
 * @returns 성공 실패 여부
 */
export const IsBookWhereProperty = (validationOptions?) => {
  const DECORATOR_NAME = 'IsBookWhereProperty';

  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: DECORATOR_NAME,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(check: keyof BookWhereInterface): boolean {
          const bookWhereProps: Array<keyof BookWhereInterface> = [
            'title',
            'price',
            'bookReport',
            'startDate',
            'endDate',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ];

          return bookWhereProps.indexOf(check) !== -1;
        },
      },
    });
  };
};
