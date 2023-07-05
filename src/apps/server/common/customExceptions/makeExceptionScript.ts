export const makeExceptionScript = (title: string, message: string): { message: string; title: string } => {
  return {
    title,
    message,
  };
};
