
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SessionAuthGuard } from './session-auth.guard';



@Module({
  imports: [
    UserModule,
    JwtModule.register({ 
      global: true, 
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, SessionAuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
