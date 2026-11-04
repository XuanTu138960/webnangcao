import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../../entities/user.entity';
import { Recipe } from '../../entities/recipe.entity';
import { Comment } from '../../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, Comment])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
