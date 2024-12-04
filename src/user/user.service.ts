import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone'; 
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>, 
    ){}

    async registerUser(registerUser: RegisterUserDto): Promise<{ message: string }> {
         // Validate DTO
        // Chuyển đổi đối tượng vào lớp RegisterUserDto
        const dto = plainToClass(RegisterUserDto, registerUser);

        // Validate toàn bộ DTO
        const errors = await validate(dto);

        if (errors.length > 0) {
            const messages = errors.map(error => Object.values(error.constraints)).flat(); // Lấy tất cả thông báo lỗi
            throw new HttpException(messages.join(' '), HttpStatus.BAD_REQUEST); // Ghép thông báo thành chuỗi
        }

        const { username, password } = dto;

        // Kiểm tra xem tên đăng nhập đã tồn tại (phân biệt hoa thường)
        const checkExistingUsername = await this.UserRepository
            .createQueryBuilder("user")
            .where("user.username COLLATE utf8mb4_bin = :username", { username })
            .getOne();
        if (checkExistingUsername) {
            throw new HttpException('Tên đăng nhập đã tồn tại.', HttpStatus.CONFLICT);
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = this.UserRepository.create({
            username,
            password: hashedPassword,
            createdAt: moment.tz('Asia/Ho_Chi_Minh').format()
        });

        try {
            // Lưu người dùng vào cơ sở dữ liệu
            await this.UserRepository.save(newUser);
            return { message: 'Đăng ký thành công!' };
        } catch (error) {
            throw new HttpException('Đã xảy ra lỗi trong quá trình đăng ký.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async findByUsername(key: string): Promise<User | null> {
        return this.UserRepository
        .createQueryBuilder('user')
        .where('user.username COLLATE utf8mb4_bin = :key', { key })
        .getOne();
    }

    async findByEmail(key: string): Promise<User | null> {
        return this.UserRepository
        .createQueryBuilder('user')
        .where({ email: key })
        .getOne();
    }

    async findAll(): Promise<User[]> {
        return await this.UserRepository.find();
    }

    // Tạo người dùng mới khi đăng nhập qua Google
  async createGoogleUser(username: string, email: string, googleId: string): Promise<User> {
    const user = this.UserRepository.create({
        username,
        email,
        googleId,
        password: '', 
        createdAt: moment.tz('Asia/Ho_Chi_Minh').format()
    }); 
    return this.UserRepository.save(user);
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded; // Trả về payload đã giải mã
    } catch (error) {
      throw new HttpException("Token không hợp lệ.", HttpStatus.UNAUTHORIZED);
    }
  }

}