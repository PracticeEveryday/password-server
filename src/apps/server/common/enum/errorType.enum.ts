export type BaseExceptionPropertyType = 'statusCode' | 'title' | 'errorType' | 'raw';

export type ExceptionPropertyType = 'title' | 'raw';

export enum ErrorTypeEnum {
  WARN = 'warn',
  ERROR = 'error',
}
