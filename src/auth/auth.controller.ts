import { Controller,  Body, Post, HttpException, HttpStatus,  UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ){}

    @Post('login')
    async login(@Body() body: { key: string; password: string }, @Req() req) {
        const { key, password } = body;
        const tryFindUser = await this.userService.findByUsername(key);
        if (!tryFindUser) {
          throw new HttpException('Tài khoản không tồn tại.', HttpStatus.NOT_FOUND);
        }
        const user = await this.authService.validateUser(key, password);
        if (!user) {
          throw new HttpException('Mật khẩu không chính xác.', HttpStatus.UNAUTHORIZED);
        }
        const access_token = await this.authService.createToken(user);
        req.session.user = user;
        req.session.token = access_token;
        return {
            message: 'Đăng nhập thành công',
            access_token, 
            username: user.username, 
        };
    }

   
    @Post('google')
    async googleLogin(@Body() body: { googleToken: string}, @Req() req) {
        // Xác thực Google token và tạo JWT
        const user = await this.authService.validateGoogleToken(body.googleToken);
        const access_token = await this.authService.createToken(user);
        req.session.user = user;
        req.session.token = access_token;
        return { 
            message: 'Đăng nhập thành công',
            token: access_token, 
            username: user.username  
        };
    }

    @Get('google')
    @UseGuards(AuthGuard('google')) 
    googleAuth() {}
    
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        const user = req.user;
        req.session.user = req.user;
        return this.authService.createToken(user);
    }
    
}
