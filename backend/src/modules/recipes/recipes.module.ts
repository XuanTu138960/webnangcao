import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from '../../entities/recipe.entity';
import { RecipeLike } from '../../entities/recipe-like.entity';
import { SavedRecipe } from '../../entities/saved-recipe.entity';
import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      RecipeLike,
      SavedRecipe,
      Notification,
      User,
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
