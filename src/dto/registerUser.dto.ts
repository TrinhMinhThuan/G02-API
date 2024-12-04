import { IsEmail, IsEmpty, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
    @IsString({ message: 'Tên người dùng phải là chuỗi.' })
    @IsNotEmpty({ message: 'Tên người dùng không được để trống.' })
    @Length(4, 50, { message: 'Tên người dùng phải có độ dài từ 4 đến 50 ký tự.' })
    username: string;


    @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
    @Length(4, 255, { message: 'Mật khẩu phải có độ dài từ 4 đến 255 ký tự.' }) // Cập nhật điều kiện mật khẩu
    password: string;
}