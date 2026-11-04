import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Recipe } from '../entities/recipe.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, Comment])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
