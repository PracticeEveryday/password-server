import { ErrorCode } from '@apps/server/common/customExceptions/errorCode';
import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';

/**
 * ExceptionScript를 만들어서 반환합니다.
 * @param title 제목
 * @param errorCode 에러 코드
 * @param errorMessage 에러 메시지
 */
export const makeExceptionScript = (
  title: string,
  errorCode: ErrorCode,
  errorMessage: ErrorMessage,
): { title: string; errorCode: ErrorCode; errorMessage: ErrorMessage } => {
  return {
    title,
    errorCode,
    errorMessage,
  };
};
