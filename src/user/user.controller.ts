import { Controller, Get, Post, Body, UseGuards, Req} from "@nestjs/common";
import { AuthGuard } from '../auth/auth.guard'
import { UserService } from "./user.service";
import { RegisterUserDto } from "../dto/registerUser.dto";
import { User } from './user.entity'
import * as jwt from 'jsonwebtoken'

@Controller('user') 
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    
    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.userService.registerUser(registerUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    async getProfile(@Req() req) {        
        const authorization = req.headers['authorization'];
    
        const token = authorization.split(' ')[1];
        const user = this.userService.verifyToken(token) ;
        return user;
    }

}