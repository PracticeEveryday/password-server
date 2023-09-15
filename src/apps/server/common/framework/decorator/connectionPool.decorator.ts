import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * interceptor로 만든 connectionPool을 가져옵니다.
 */
export const TransactionManager = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.connectionPool;
});
