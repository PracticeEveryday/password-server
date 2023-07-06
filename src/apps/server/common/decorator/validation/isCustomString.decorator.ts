import { applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function IsOptionalString(min?: number, max?: number) {
  if (min) {
    return applyDecorators(IsOptional(), IsString(), Expose(), MinLength(min));
  }
  if (max) {
    return applyDecorators(IsOptional(), IsString(), Expose(), MaxLength(max));
  }

  if (max && min) {
    return applyDecorators(IsOptional(), IsString(), Expose(), MaxLength(max), MinLength(min));
  }

  return applyDecorators(IsOptional(), IsString(), Expose());
}

/**
 * 무조건 값이 있어야 하는 string validation 입니다.
 * @param min? 최소 길이
 * @param max? 최대 길이
 */
export function IsNotEmptyString(min?: number, max?: number) {
  if (min) {
    return applyDecorators(IsNotEmpty(), IsString(), Expose(), MinLength(min));
  }
  if (max) {
    return applyDecorators(IsNotEmpty(), IsString(), Expose(), MaxLength(max));
  }

  if (max && min) {
    return applyDecorators(IsNotEmpty(), IsString(), Expose(), MaxLength(max), MinLength(min));
  }

  return applyDecorators(IsNotEmpty(), IsString(), Expose());
}
