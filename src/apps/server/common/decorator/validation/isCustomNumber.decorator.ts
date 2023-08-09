import { applyDecorators } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';

const getNumberValidation = (value: string, min?: number, max?: number) => {
  return {
    isNotEmpty: IsNotEmpty({ message: `${value}${ErrorResponse.VALIDATION.IS_NOT_EMPTY}` }),
    isNumber: IsNumber({}, { message: `${value}${ErrorResponse.VALIDATION.IS_NUMBER} ` }),
    max: Max(max, { message: `${value}${ErrorResponse.VALIDATION.NUMBER_LESS_THEN.replace('###value###', String(max))}` }),
    min: Min(min, { message: `${value}${ErrorResponse.VALIDATION.NUMBER_GREATER_THEN.replace('###value###', String(min))}` }),
  };
};

export function IsOptionalNumber(value: string, min?: number, max?: number) {
  const numberValidation = getNumberValidation(value, min, max);

  if (max) {
    return applyDecorators(
      IsOptional(),
      numberValidation.max,
      numberValidation.isNumber,
      Type(() => Number),
      Expose(),
    );
  }
  if (min) {
    return applyDecorators(
      IsOptional(),
      numberValidation.min,
      numberValidation.isNumber,
      Type(() => Number),
      Expose(),
    );
  }

  if (min && max) {
    return applyDecorators(
      IsOptional(),
      numberValidation.max,
      numberValidation.min,
      numberValidation.isNumber,
      Type(() => Number),
      Expose(),
    );
  }

  return applyDecorators(
    IsOptional(),
    numberValidation.isNumber,
    Type(() => Number),
    Expose(),
  );
}

export function IsNotEmptyNumber(value: string, min?: number, max?: number) {
  const numberValidation = getNumberValidation(value, min, max);

  if (max) {
    return applyDecorators(
      numberValidation.max,
      numberValidation.isNumber,
      numberValidation.isNotEmpty,
      Type(() => Number),
      Expose(),
    );
  }
  if (min) {
    return applyDecorators(
      numberValidation.min,
      numberValidation.isNumber,
      numberValidation.isNotEmpty,
      Type(() => Number),
      Expose(),
    );
  }

  if (min && max) {
    return applyDecorators(
      numberValidation.max,
      numberValidation.min,
      numberValidation.isNumber,
      numberValidation.isNotEmpty,
      Type(() => Number),
      Expose(),
    );
  }

  return applyDecorators(
    numberValidation.isNumber,
    numberValidation.isNotEmpty,
    Type(() => Number),
    Expose(),
  );
}
