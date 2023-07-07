/**
 * ExceptionScript를 만들어서 반환합니다.
 * @param title 제목
 * @param message 메세지
 */
export const makeExceptionScript = (title: string, message: string): { message: string; title: string } => {
  return {
    title,
    message,
  };
};
