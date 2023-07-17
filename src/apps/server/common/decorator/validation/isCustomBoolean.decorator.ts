import { applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
// eslint-disable-next-line import/named
import { IsNotEmpty, IsOptional, ValidationArguments, ValidationOptions, registerDecorator, IsBoolean } from 'class-validator';

export function IsTrue(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTrue',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'boolean') {
            return false;
          }
          if (value === false) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be true`;
        },
      },
    });
  };
}

export function IsOptionalBoolean() {
  return applyDecorators(IsBoolean(), IsOptional(), IsTrue);
}

export function IsNotEmptyBoolean() {
  return applyDecorators(IsBoolean(), Expose(), IsNotEmpty());
}
