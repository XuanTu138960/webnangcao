import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '../../entities/comment.entity';
import { Recipe } from '../../entities/recipe.entity';
import { Notification } from '../../entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Recipe, Notification])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
