import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  // Xác thực người dùng dựa trên username/email và mật khẩu
  async validateUser(key: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(key);
    if (user && bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; // loại bỏ password trước khi trả về kết quả
      return result;
    }
    return null;
  }

  // Tạo JWT cho người dùng khi đăng nhập thành công  
  async createToken(user: any) {
    // Payload JWT có thể bao gồm các thông tin bổ sung như role, email, ...
    const payload = { username: user.username, id: user.id, email: user.email, createdAt: user.createdAt }; 
    return this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET, // Dùng secret key từ .env để bảo mật
        expiresIn: '20m', // Thời gian hết hạn token 
      });
  }

  

  // Phương thức kiểm tra token khi người dùng gửi yêu cầu bảo vệ
  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded;
    } catch (error) {
      throw new HttpException('Invalid or expired token!', HttpStatus.UNAUTHORIZED);
    }
  }

   async validateGoogleToken(googleToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleToken, 
      audience: process.env.GOOGLE_CLIENT_ID, 
    });
    
    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;

    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.createGoogleUser(username, email, payload.sub); // Tạo người dùng mới nếu không tìm thấy
    }

    return user;

  }

}
