// Service xác thực - Đăng ký, đăng nhập, JWT
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Đăng ký tài khoản mới
  async register(registerDto: RegisterDto) {
    const { fullName, username, email, password } = registerDto;

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Tên đăng nhập này đã được sử dụng');
    }

    // Mã hóa mật khẩu với bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = this.userRepository.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Tạo JWT token
    const token = this.generateToken(savedUser);

    return {
      message: 'Đăng ký tài khoản thành công! Chào mừng bạn đến với Cookio 🍜',
      token,
      user: this.sanitizeUser(savedUser),
    };
  }

  // Đăng nhập
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user theo email hoặc username
    const user = await this.userRepository.findOne({
      where: [{ email }, { username: email }],
    });

    if (!user) {
      throw new UnauthorizedException('Email/tên đăng nhập hoặc mật khẩu không đúng');
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ admin.');
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email/tên đăng nhập hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const token = this.generateToken(user);

    return {
      message: `Đăng nhập thành công! Chào mừng trở lại, ${user.fullName} 👋`,
      token,
      user: this.sanitizeUser(user),
    };
  }

  // Đổi mật khẩu
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Xác nhận mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Đổi mật khẩu thành công' };
  }

  // Lấy thông tin profile hiện tại
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    return this.sanitizeUser(user);
  }

  // Tạo JWT token từ user
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  // Loại bỏ thông tin nhạy cảm trước khi trả về client
  private sanitizeUser(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
