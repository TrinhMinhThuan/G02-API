import { CanActivate, ExecutionContext, Injectable, HttpException,HttpStatus } from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.session || !request.session.user) {
      throw new HttpException("Tài khoản không xác định.", HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
