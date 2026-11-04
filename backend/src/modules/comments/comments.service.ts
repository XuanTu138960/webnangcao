import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { Recipe } from '../../entities/recipe.entity';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { UserRole } from '../../entities/user.entity';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  // Lấy bình luận của một công thức (dạng cây lồng nhau)
  async findByRecipe(recipeId: string) {
    const comments = await this.commentRepository.find({
      where: { recipeId, isVisible: true },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'DESC' },
    });

    // Lọc lấy comment cấp 1
    return comments.filter((c) => !c.parentId);
  }

  // Tạo bình luận mới hoặc phản hồi
  async create(createDto: CreateCommentDto, userId: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id: createDto.recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Không tìm thấy công thức');
    }

    const comment = this.commentRepository.create({
      content: createDto.content,
      rating: createDto.rating || null,
      recipeId: createDto.recipeId,
      parentId: createDto.parentId || null,
      authorId: userId,
    });

    const saved = await this.commentRepository.save(comment);

    // Cập nhật số bình luận và điểm đánh giá của công thức
    await this.recipeRepository.increment({ id: recipe.id }, 'commentsCount', 1);

    if (createDto.rating) {
      const allRatings = await this.commentRepository
        .createQueryBuilder('c')
        .where('c.recipeId = :recipeId', { recipeId: recipe.id })
        .andWhere('c.rating IS NOT NULL')
        .getMany();

      const avg =
        allRatings.reduce((sum, item) => sum + (item.rating || 0), 0) /
        allRatings.length;

      await this.recipeRepository.update(recipe.id, {
        averageRating: Math.round(avg * 10) / 10,
        ratingCount: allRatings.length,
      });
    }

    // Gửi thông báo
    if (createDto.parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: createDto.parentId },
      });
      if (parentComment && parentComment.authorId !== userId) {
        await this.notificationRepository.save(
          this.notificationRepository.create({
            type: NotificationType.REPLY,
            message: `đã trả lời bình luận của bạn về món "${recipe.title}"`,
            recipientId: parentComment.authorId,
            actorId: userId,
            referenceId: recipe.id,
            referenceType: 'recipe',
          }),
        );
      }
    } else if (recipe.authorId !== userId) {
      await this.notificationRepository.save(
        this.notificationRepository.create({
          type: NotificationType.COMMENT,
          message: `đã bình luận về công thức "${recipe.title}" của bạn`,
          recipientId: recipe.authorId,
          actorId: userId,
          referenceId: recipe.id,
          referenceType: 'recipe',
        }),
      );
    }

    return this.commentRepository.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });
  }

  // Xóa bình luận
  async remove(id: string, user: any) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (comment.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.commentRepository.remove(comment);
    await this.recipeRepository.decrement({ id: comment.recipeId }, 'commentsCount', 1);
    return { success: true, message: 'Đã xóa bình luận' };
  }
}
