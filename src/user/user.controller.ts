import { Controller, Get, Post, Body } from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from './user.entity';
import { RegisterUserDto } from "src/dto/registerUser.dto";

@Controller('user') 
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    
    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.userService.registerUser(registerUserDto);
      }

    @Get()
    getHello(): string {
        return "Hello from user!";
    }

}