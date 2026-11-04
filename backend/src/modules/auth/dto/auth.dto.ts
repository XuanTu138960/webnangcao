// DTO cho xác thực người dùng
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO đăng ký tài khoản mới
export class RegisterDto {
  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Thị Lan',
  })
  @IsString()
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Tên không được vượt quá 100 ký tự' })
  fullName: string;

  @ApiProperty({
    description: 'Tên đăng nhập (không dấu, không khoảng trắng)',
    example: 'nguyen_thi_lan',
  })
  @IsString()
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Tên đăng nhập không được vượt quá 50 ký tự' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
  })
  username: string;

  @ApiProperty({
    description: 'Địa chỉ email hợp lệ',
    example: 'lan.nguyen@gmail.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu (ít nhất 6 ký tự)',
    example: 'MatKhau@123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(50, { message: 'Mật khẩu không được vượt quá 50 ký tự' })
  password: string;
}

// DTO đăng nhập
export class LoginDto {
  @ApiProperty({
    description: 'Email hoặc tên đăng nhập',
    example: 'lan.nguyen@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'MatKhau@123',
  })
  @IsString()
  password: string;
}

// DTO đổi mật khẩu
export class ChangePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại', example: 'OldPass@123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới', example: 'NewPass@123' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  newPassword: string;
}
