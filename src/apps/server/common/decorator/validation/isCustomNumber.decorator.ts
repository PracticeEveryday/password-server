import { applyDecorators } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export function IsOptionalNumber(min?: number, max?: number) {
  if (max) {
    return applyDecorators(
      IsOptional(),
      Max(max),
      IsNumber(),
      Type(() => Number),
      Expose(),
    );
  }
  if (min) {
    return applyDecorators(
      IsOptional(),
      Min(min),
      IsNumber(),
      Type(() => Number),
      Expose(),
    );
  }

  if (min && max) {
    return applyDecorators(
      IsOptional(),
      Min(min),
      Max(max),
      IsNumber(),
      Type(() => Number),
      Expose(),
    );
  }

  return applyDecorators(
    IsOptional(),
    IsNumber(),
    Type(() => Number),
    Expose(),
  );
}

export function IsNotEmptyNumber(min?: number, max?: number) {
  if (max) {
    return applyDecorators(
      IsNotEmpty(),
      Max(max),
      IsNumber(),
      Type(() => Number),
      Expose(),
    );
  }
  if (min) {
    return applyDecorators(
      IsNotEmpty(),
      Min(min),
      IsNumber(),
      Type(() => Number),
      Expose(),
    );
  }

  if (min && max) {
    return applyDecorators(
      IsNotEmpty(),
      Min(min),
      Max(max),
      IsNumber(),
      Type(() => Number),
      Expose(),
    );
  }

  return applyDecorators(
    IsNotEmpty(),
    IsNumber(),
    Type(() => Number),
    Expose(),
  );
}
