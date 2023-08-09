import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';

/**
 * ExceptionScript를 만들어서 반환합니다.
 * @param title 제목
 * @param errorResponse 에러 메시지
 */
export const makeExceptionScript = (title: string, errorResponse: ErrorResponse): { title: string; errorResponse: ErrorResponse } => {
  return {
    title,
    errorResponse,
  };
};
