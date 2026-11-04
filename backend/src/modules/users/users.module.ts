import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { Follow } from '../../entities/follow.entity';
import { Recipe } from '../../entities/recipe.entity';
import { SavedRecipe } from '../../entities/saved-recipe.entity';
import { RecipeLike } from '../../entities/recipe-like.entity';
import { Notification } from '../../entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Follow,
      Recipe,
      SavedRecipe,
      RecipeLike,
      Notification,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
