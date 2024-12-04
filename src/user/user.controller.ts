import { Controller, Get, Post, Body, UseGuards,Req } from "@nestjs/common";
import { SessionAuthGuard } from '../auth/session-auth.guard'
import { UserService } from "./user.service";
import { RegisterUserDto } from "../dto/registerUser.dto";
import { User } from './user.entity'

@Controller('user') 
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    
    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.userService.registerUser(registerUserDto);
    }

    @UseGuards(SessionAuthGuard)
    @Get('/profile')
    async getProfile(@Req() req): Promise<User | undefined> {
        return req.session.user;
    }

}