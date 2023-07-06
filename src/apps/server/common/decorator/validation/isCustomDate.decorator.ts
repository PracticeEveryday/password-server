import { applyDecorators } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export function IsOptionalDate() {
  return applyDecorators(
    IsDate(),
    Expose(),
    IsOptional(),
    Type(() => Date),
  );
}

export function IsNotEmptyDate() {
  return applyDecorators(
    IsDate(),
    Expose(),
    IsNotEmpty(),
    Type(() => Date),
  );
}
