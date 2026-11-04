import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/modules/auth/auth.service';
import { User, UserRole } from '../src/entities/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;

  const mockUser = {
    id: 'user-uuid',
    username: 'nguyenxuantu',
    fullName: 'Nguyễn Xuân Tú',
    email: '23010538@st.phenikaa-uni.edu.vn',
    password: '$2a$10$hashedpasswordforsecuritytestonly',
    role: UserRole.USER,
    isActive: true,
  };

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (Array.isArray(where)) {
        // [{ username: ... }, { email: ... }]
        return Promise.resolve(null);
      }
      if (where.username === mockUser.username || where.email === mockUser.email) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({ id: 'generated-uuid', ...user }),
    ),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
  });

  it('AuthService nên được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('nên đăng ký tài khoản thành công và trả về token', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as any);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as any);

      const registerDto = {
        fullName: 'Nguyễn Xuân Tú',
        username: 'newuser123',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const result = await service.register(registerDto);
      expect(result).toBeDefined();
      expect(result.token).toEqual('mock.jwt.token');
      expect(result.user.username).toEqual(registerDto.username);
    });
  });

  describe('login', () => {
    it('nên ném lỗi UnauthorizedException khi tài khoản không tồn tại', async () => {
      await expect(
        service.login({ email: 'unknown_user@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('nên đăng nhập thành công khi mật khẩu chính xác', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);

      const result = await service.login({
        email: '23010538@st.phenikaa-uni.edu.vn',
        password: 'correctpassword',
      });

      expect(result).toBeDefined();
      expect(result.token).toEqual('mock.jwt.token');
      expect(result.user.username).toEqual('nguyenxuantu');
    });
  });
});
