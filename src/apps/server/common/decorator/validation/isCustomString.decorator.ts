import { applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';

const getStringValidation = (value: string, min?: number, max?: number) => {
  return {
    isNotEmpty: IsNotEmpty({ message: `${value}${ErrorMessage.VALIDATION.IS_NOT_EMPTY}` }),
    isString: IsString({ message: `${value}${ErrorMessage.VALIDATION.IS_STRING} ` }),
    maxLength: MaxLength(max, { message: `${value}${ErrorMessage.VALIDATION.STRING_LESS_THEN.replace('###value###', String(max))}` }),
    minLength: MinLength(max, { message: `${value}${ErrorMessage.VALIDATION.STRING_GREATER_THEN.replace('###value###', String(max))}` }),
  };
};

export function IsOptionalString(value: string, min?: number, max?: number) {
  const stringValidation = getStringValidation(value, min, max);
  if (min) {
    return applyDecorators(Expose(), IsOptional(), stringValidation.isString, stringValidation.minLength);
  }

  if (max) {
    return applyDecorators(Expose(), IsOptional(), stringValidation.isString, stringValidation.maxLength);
  }

  if (max && min) {
    return applyDecorators(Expose(), IsOptional(), stringValidation.isString, stringValidation.maxLength, stringValidation.minLength);
  }

  return applyDecorators(Expose(), IsOptional(), stringValidation.isString);
}

export function IsNotEmptyString(value: string, min?: number, max?: number) {
  const stringValidation = getStringValidation(value, min, max);
  if (min) {
    return applyDecorators(Expose(), stringValidation.isNotEmpty, stringValidation.isString, stringValidation.minLength);
  }

  if (max) {
    return applyDecorators(Expose(), stringValidation.isNotEmpty, stringValidation.isString, stringValidation.maxLength);
  }

  if (max && min) {
    return applyDecorators(
      Expose(),
      stringValidation.isNotEmpty,
      stringValidation.isString,
      stringValidation.maxLength,
      stringValidation.minLength,
    );
  }

  return applyDecorators(Expose(), stringValidation.isNotEmpty, stringValidation.isString);
}
