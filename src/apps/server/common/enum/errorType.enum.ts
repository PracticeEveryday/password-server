export type BaseExceptionPropertyType = 'statusCode' | 'title' | 'message' | 'errorType' | 'raw';

export type ExceptionPropertyType = 'title' | 'message' | 'raw';

export enum ErrorTypeEnum {
  WARN = 'warn',
  ERROR = 'error',
}
