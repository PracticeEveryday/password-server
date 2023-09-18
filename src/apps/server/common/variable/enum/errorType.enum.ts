export type BaseExceptionPropertyType = 'statusCode' | 'errorType' | 'raw' | 'errorResponse' | 'message';

export type ExceptionPropertyType = 'errorResponse' | 'raw';

export enum ErrorTypeEnum {
  WARN = 'warn',
  ERROR = 'error',
}
