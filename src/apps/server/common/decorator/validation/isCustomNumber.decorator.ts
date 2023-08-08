import { applyDecorators } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';

export function IsOptionalNumber(value: string, min?: number, max?: number) {
  if (max) {
    return applyDecorators(
      IsOptional(),
      Max(max, { message: `${value}${ErrorMessage.VALIDATION.NUMBER_LESS_THEN.replace('###value###', max.toString())}` }),
      IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
      Type(() => Number),
      Expose(),
    );
  }
  if (min) {
    return applyDecorators(
      IsOptional(),
      Min(min, {
        message: `${value}${ErrorMessage.VALIDATION.NUMBER_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
      IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
      Type(() => Number),
      Expose(),
    );
  }

  if (min && max) {
    return applyDecorators(
      IsOptional(),
      Min(min, {
        message: `${value}${ErrorMessage.VALIDATION.NUMBER_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
      Max(max, { message: `${value}${ErrorMessage.VALIDATION.NUMBER_LESS_THEN.replace('###value###', max.toString())}` }),
      IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
      Type(() => Number),
      Expose(),
    );
  }

  return applyDecorators(
    IsOptional(),
    IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
    Type(() => Number),
    Expose(),
  );
}

export function IsNotEmptyNumber(value: string, min?: number, max?: number) {
  if (max) {
    return applyDecorators(
      IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
      Max(max, { message: `${value}${ErrorMessage.VALIDATION.NUMBER_LESS_THEN.replace('###value###', max.toString())}` }),
      IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
      Type(() => Number),
      Expose(),
    );
  }
  if (min) {
    return applyDecorators(
      IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
      Min(min, {
        message: `${value}${ErrorMessage.VALIDATION.NUMBER_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
      IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
      Type(() => Number),
      Expose(),
    );
  }

  if (min && max) {
    return applyDecorators(
      IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
      Min(min, {
        message: `${value}${ErrorMessage.VALIDATION.NUMBER_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
      Max(max, { message: `${value}${ErrorMessage.VALIDATION.NUMBER_LESS_THEN.replace('###value###', max.toString())}` }),
      IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
      Type(() => Number),
      Expose(),
    );
  }

  return applyDecorators(
    IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
    IsNumber({}, { message: `${value}${ErrorMessage.VALIDATION.IS_NUMBER} ` }),
    Type(() => Number),
    Expose(),
  );
}
