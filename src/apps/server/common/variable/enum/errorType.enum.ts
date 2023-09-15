export type BaseExceptionPropertyType = 'statusCode' | 'errorType' | 'raw' | 'errorResponse';

export type ExceptionPropertyType = 'raw' | 'errorResponse';

export enum ErrorTypeEnum {
  WARN = 'warn',
  ERROR = 'error',
}
