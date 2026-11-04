// Module gốc của ứng dụng Cookio
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CookbooksModule } from './modules/cookbooks/cookbooks.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedModule } from './seed/seed.module';

// Import tất cả các entity
import { User } from './entities/user.entity';
import { Recipe } from './entities/recipe.entity';
import { Comment } from './entities/comment.entity';
import { SavedRecipe } from './entities/saved-recipe.entity';
import { RecipeLike } from './entities/recipe-like.entity';
import { Follow } from './entities/follow.entity';
import { Cookbook } from './entities/cookbook.entity';
import { CookbookRecipe } from './entities/cookbook-recipe.entity';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    // Cấu hình rate limiting - chống spam
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL) || 60000,
        limit: parseInt(process.env.THROTTLE_LIMIT) || 100,
      },
    ]),

    // Cấu hình TypeORM với SQLite - không cần server DB riêng
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || './cookio.sqlite',
      entities: [
        User,
        Recipe,
        Comment,
        SavedRecipe,
        RecipeLike,
        Follow,
        Cookbook,
        CookbookRecipe,
        Notification,
      ],
      synchronize: true, // Tự động tạo bảng từ entity (chỉ dùng dev)
      logging: process.env.NODE_ENV === 'development',
    }),

    // Các module chức năng
    AuthModule,
    UsersModule,
    RecipesModule,
    CommentsModule,
    NotificationsModule,
    CookbooksModule,
    AdminModule,
    SeedModule,
  ],
})
export class AppModule {}
