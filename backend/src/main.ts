// Điểm vào chính của ứng dụng Cookio Backend
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bảo mật với Helmet
  app.use(helmet());

  // Phân tích Cookie
  app.use(cookieParser());

  // Tiền tố API toàn cục
  app.setGlobalPrefix('api/v1');

  // Cấu hình CORS cho phép frontend kết nối
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Validation pipe toàn cục - tự động validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Loại bỏ các trường không được định nghĩa
      forbidNonWhitelisted: true, // Báo lỗi nếu có trường lạ
      transform: true,         // Tự động chuyển đổi kiểu dữ liệu
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filter xử lý lỗi HTTP toàn cục
  app.useGlobalFilters(new HttpExceptionFilter());

  // Endpoint kiểm tra sức khỏe hệ thống (Health Check cho Docker)
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
    res.status(200).json({
      status: 'ok',
      service: 'cookio-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Cấu hình Swagger UI - API Documentation
  const config = new DocumentBuilder()
    .setTitle('🍜 Cookio API')
    .setDescription(
      'API backend cho website nấu ăn Cookio - Khám phá ẩm thực Việt Nam. ' +
      'Bao gồm các tính năng: Công thức nấu ăn, Bình luận, Yêu thích, ' +
      'Lưu công thức, Theo dõi người dùng, Thông báo và nhiều hơn nữa.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT token để xác thực',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Đăng ký & Đăng nhập')
    .addTag('Users', 'Quản lý người dùng')
    .addTag('Recipes', 'Công thức nấu ăn')
    .addTag('Comments', 'Bình luận & Đánh giá')
    .addTag('Cookbooks', 'Bộ sưu tập công thức')
    .addTag('Notifications', 'Thông báo')
    .addTag('Admin', 'Quản trị hệ thống')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════╗
  ║        🍜 COOKIO BACKEND SERVER           ║
  ║═══════════════════════════════════════════║
  ║  Server:  http://localhost:${port}           ║
  ║  API:     http://localhost:${port}/api/v1    ║
  ║  Docs:    http://localhost:${port}/api/docs  ║
  ╚═══════════════════════════════════════════╝
  `);
}

bootstrap();
