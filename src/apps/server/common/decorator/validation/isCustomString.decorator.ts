import { applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';

export function IsOptionalString(value: string, min?: number, max?: number) {
  if (min) {
    return applyDecorators(
      IsOptional(),
      IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
      Expose(),
      MinLength(min, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
    );
  }
  if (max) {
    return applyDecorators(
      IsOptional(),
      IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
      Expose(),
      MaxLength(max, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_LESS_THEN.replace('###value###', max.toString())}`,
      }),
    );
  }

  if (max && min) {
    return applyDecorators(
      IsOptional(),
      IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
      Expose(),
      MaxLength(max, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_LESS_THEN.replace('###value###', max.toString())}`,
      }),
      MinLength(min, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
    );
  }

  return applyDecorators(IsOptional(), IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }), Expose());
}

/**
 * 무조건 값이 있어야 하는 string validation 입니다.
 * @param min? 최소 길이
 * @param max? 최대 길이
 */
export function IsNotEmptyString(value: string, min?: number, max?: number) {
  if (min) {
    return applyDecorators(
      IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
      IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
      Expose(),
      MinLength(min, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
    );
  }
  if (max) {
    return applyDecorators(
      IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
      IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
      Expose(),
      MaxLength(max, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_LESS_THEN.replace('###value###', max.toString())}`,
      }),
    );
  }

  if (max && min) {
    return applyDecorators(
      IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
      IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
      Expose(),
      MaxLength(max, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_LESS_THEN.replace('###value###', max.toString())}`,
      }),
      MinLength(min, {
        message: `${value}${ErrorMessage.VALIDATION.STRING_GREATER_THEN.replace('###value###', min.toString())}`,
      }),
    );
  }

  return applyDecorators(
    IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
    IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
    Expose(),
  );
}
