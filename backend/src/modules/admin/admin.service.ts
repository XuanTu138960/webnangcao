import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Recipe } from '../../entities/recipe.entity';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // Lấy số liệu thống kê tổng quan
  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();
    const totalRecipes = await this.recipeRepository.count();
    const totalComments = await this.commentRepository.count();

    const stats = await this.recipeRepository
      .createQueryBuilder('recipe')
      .select('SUM(recipe.viewsCount)', 'totalViews')
      .addSelect('SUM(recipe.likesCount)', 'totalLikes')
      .getRawOne();

    const recentRecipes = await this.recipeRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const recentUsers = await this.userRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      select: ['id', 'username', 'fullName', 'email', 'role', 'createdAt', 'isActive'],
    });

    return {
      totalUsers,
      totalRecipes,
      totalComments,
      totalViews: parseInt(stats.totalViews) || 0,
      totalLikes: parseInt(stats.totalLikes) || 0,
      recentRecipes,
      recentUsers,
    };
  }

  // Quản lý người dùng
  async getAllUsers(page = 1, limit = 20) {
    const [data, total] = await this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      select: [
        'id',
        'username',
        'fullName',
        'email',
        'role',
        'isActive',
        'recipesCount',
        'followersCount',
        'createdAt',
      ],
    });
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async toggleUserStatus(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return { success: true, isActive: user.isActive };
  }

  // Quản lý công thức
  async getAllRecipes(page = 1, limit = 20) {
    const [data, total] = await this.recipeRepository.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async toggleRecipePublished(id: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) throw new NotFoundException('Công thức không tồn tại');
    recipe.isPublished = !recipe.isPublished;
    await this.recipeRepository.save(recipe);
    return { success: true, isPublished: recipe.isPublished };
  }

  async toggleRecipeFeatured(id: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) throw new NotFoundException('Công thức không tồn tại');
    recipe.isFeatured = !recipe.isFeatured;
    await this.recipeRepository.save(recipe);
    return { success: true, isFeatured: recipe.isFeatured };
  }

  // Quản lý bình luận
  async getAllComments(page = 1, limit = 30) {
    const [data, total] = await this.commentRepository.findAndCount({
      relations: ['author', 'recipe'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async toggleCommentVisibility(id: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại');
    comment.isVisible = !comment.isVisible;
    await this.commentRepository.save(comment);
    return { success: true, isVisible: comment.isVisible };
  }
}
