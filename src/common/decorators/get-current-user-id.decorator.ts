import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { JwtPayload } from "src/common/types";

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    // console.log(request);
    
    if (!user) throw new ForbiddenException("Token noto'g'ri");
    console.log("user:", user);

    return user.sub;
  }
);
