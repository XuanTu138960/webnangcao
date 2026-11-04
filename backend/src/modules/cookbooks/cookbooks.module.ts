import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookbooksController } from './cookbooks.controller';
import { CookbooksService } from './cookbooks.service';
import { Cookbook } from '../../entities/cookbook.entity';
import { CookbookRecipe } from '../../entities/cookbook-recipe.entity';
import { Recipe } from '../../entities/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cookbook, CookbookRecipe, Recipe])],
  controllers: [CookbooksController],
  providers: [CookbooksService],
  exports: [CookbooksService],
})
export class CookbooksModule {}
