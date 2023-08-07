export type BaseExceptionPropertyType = 'statusCode' | 'title' | 'errorType' | 'raw' | 'errorCode' | 'errorMessage';

export type ExceptionPropertyType = 'title' | 'raw' | 'errorCode' | 'errorMessage';

export enum ErrorTypeEnum {
  WARN = 'warn',
  ERROR = 'error',
}
