import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data === 'user' && !request.authUser[data]) {
      throw new BadRequestException('User has been registered.');
    }
    return data ? request.authUser[data] : request.authUser;
  },
);
