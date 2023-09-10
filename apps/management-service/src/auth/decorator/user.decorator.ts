import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/* on cree un decorateur personalise afin d'eviter la repetion 
  @Req request: Request au niveau des controleurs
*/
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
