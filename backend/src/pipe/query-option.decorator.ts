import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const QueryOption = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const option = {
      fields:
        request.query.fields &&
        request.query.fields.split(',').map((f: string) => f.trim()),
      limit: request.query.limit,
      offset: request.query.offset,
    };
    return option;
  },
);
