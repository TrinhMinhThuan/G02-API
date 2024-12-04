import { CanActivate, ExecutionContext, Injectable, HttpException,HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const authorization = request.headers['authorization'];
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      if (token){
        return true;
      }
      else {
        throw new HttpException("Token không hợp lệ.", HttpStatus.UNAUTHORIZED);
      }
    }
    else {
        throw new HttpException("Token không tồn tại.", HttpStatus.UNAUTHORIZED);

    }
  }
}
