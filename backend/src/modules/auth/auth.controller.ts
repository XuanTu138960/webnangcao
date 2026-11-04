// Controller xác thực - Các endpoint đăng ký, đăng nhập
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/v1/auth/register - Đăng ký tài khoản mới
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 409, description: 'Email hoặc username đã tồn tại' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // POST /api/v1/auth/login - Đăng nhập
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về JWT token' })
  @ApiResponse({ status: 401, description: 'Thông tin đăng nhập không đúng' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // GET /api/v1/auth/profile - Lấy thông tin profile hiện tại
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại' })
  @ApiResponse({ status: 200, description: 'Thông tin profile' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  // POST /api/v1/auth/change-password - Đổi mật khẩu
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản' })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Mật khẩu hiện tại không đúng' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}
