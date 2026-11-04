import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Recipe } from '../../entities/recipe.entity';
import { RecipeLike } from '../../entities/recipe-like.entity';
import { SavedRecipe } from '../../entities/saved-recipe.entity';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { User, UserRole } from '../../entities/user.entity';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
  SearchRecipeQueryDto,
  SmartFridgeDto,
} from './dto/recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeLike)
    private readonly recipeLikeRepository: Repository<RecipeLike>,
    @InjectRepository(SavedRecipe)
    private readonly savedRecipeRepository: Repository<SavedRecipe>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Lấy danh sách công thức có phân trang & bộ lọc
  async findAll(queryDto: SearchRecipeQueryDto, currentUserId?: string) {
    const page = queryDto.page ? +queryDto.page : 1;
    const limit = queryDto.limit ? +queryDto.limit : 12;
    const queryBuilder = this.recipeRepository.createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.author', 'author')
      .where('recipe.isPublished = :isPublished', { isPublished: true });

    if (queryDto.q) {
      queryBuilder.andWhere(
        '(LOWER(recipe.title) LIKE LOWER(:q) OR LOWER(recipe.description) LIKE LOWER(:q) OR LOWER(recipe.ingredients) LIKE LOWER(:q))',
        { q: `%${queryDto.q}%` },
      );
    }

    if (queryDto.category && queryDto.category !== ('Tất cả' as any)) {
      queryBuilder.andWhere('recipe.category = :category', {
        category: queryDto.category,
      });
    }

    if (queryDto.maxCookTime) {
      queryBuilder.andWhere('recipe.cookTime <= :maxCookTime', {
        maxCookTime: +queryDto.maxCookTime,
      });
    }

    if (queryDto.tag) {
      queryBuilder.andWhere('LOWER(recipe.dietaryTags) LIKE LOWER(:tag)', {
        tag: `%${queryDto.tag}%`,
      });
    }

    // Sắp xếp
    if (queryDto.sort === 'popular') {
      queryBuilder.orderBy('recipe.likesCount', 'DESC');
    } else if (queryDto.sort === 'rating') {
      queryBuilder.orderBy('recipe.averageRating', 'DESC');
    } else if (queryDto.sort === 'views') {
      queryBuilder.orderBy('recipe.viewsCount', 'DESC');
    } else {
      queryBuilder.orderBy('recipe.createdAt', 'DESC');
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    // Gắn thông tin liked/saved nếu người dùng đăng nhập
    const recipesWithStatus = await Promise.all(
      items.map(async (recipe) => {
        let isLiked = false;
        let isSaved = false;
        if (currentUserId) {
          isLiked = !!(await this.recipeLikeRepository.findOne({
            where: { recipeId: recipe.id, userId: currentUserId },
          }));
          isSaved = !!(await this.savedRecipeRepository.findOne({
            where: { recipeId: recipe.id, userId: currentUserId },
          }));
        }
        return { ...recipe, isLiked, isSaved };
      }),
    );

    return {
      data: recipesWithStatus,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy chi tiết công thức
  async findOne(id: string, currentUserId?: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!recipe) {
      throw new NotFoundException(`Không tìm thấy công thức có ID ${id}`);
    }

    // Tăng lượt xem
    await this.recipeRepository.increment({ id }, 'viewsCount', 1);
    recipe.viewsCount += 1;

    let isLiked = false;
    let isSaved = false;
    if (currentUserId) {
      isLiked = !!(await this.recipeLikeRepository.findOne({
        where: { recipeId: id, userId: currentUserId },
      }));
      isSaved = !!(await this.savedRecipeRepository.findOne({
        where: { recipeId: id, userId: currentUserId },
      }));
    }

    return { ...recipe, isLiked, isSaved };
  }

  // Tạo công thức mới
  async create(createDto: CreateRecipeDto, userId: string) {
    const recipe = this.recipeRepository.create({
      ...createDto,
      authorId: userId,
    });
    const saved = await this.recipeRepository.save(recipe);
    await this.userRepository.increment({ id: userId }, 'recipesCount', 1);
    return saved;
  }

  // Cập nhật công thức
  async update(id: string, updateDto: UpdateRecipeDto, user: any) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Không tìm thấy công thức');
    }

    if (recipe.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa công thức này');
    }

    Object.assign(recipe, updateDto);
    return this.recipeRepository.save(recipe);
  }

  // Xóa công thức
  async remove(id: string, user: any) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Không tìm thấy công thức');
    }

    if (recipe.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa công thức này');
    }

    await this.recipeRepository.remove(recipe);
    await this.userRepository.decrement({ id: recipe.authorId }, 'recipesCount', 1);
    return { success: true, message: 'Đã xóa công thức thành công' };
  }

  // Thích / Bỏ thích công thức
  async toggleLike(recipeId: string, userId: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new NotFoundException('Công thức không tồn tại');
    }

    const existing = await this.recipeLikeRepository.findOne({
      where: { recipeId, userId },
    });

    if (existing) {
      await this.recipeLikeRepository.remove(existing);
      await this.recipeRepository.decrement({ id: recipeId }, 'likesCount', 1);
      return { liked: false, likesCount: Math.max(0, recipe.likesCount - 1) };
    } else {
      const like = this.recipeLikeRepository.create({ recipeId, userId });
      await this.recipeLikeRepository.save(like);
      await this.recipeRepository.increment({ id: recipeId }, 'likesCount', 1);

      // Gửi thông báo cho tác giả nếu không phải tự like
      if (recipe.authorId !== userId) {
        await this.notificationRepository.save(
          this.notificationRepository.create({
            type: NotificationType.LIKE,
            message: `đã thích công thức "${recipe.title}" của bạn`,
            recipientId: recipe.authorId,
            actorId: userId,
            referenceId: recipeId,
            referenceType: 'recipe',
          }),
        );
      }

      return { liked: true, likesCount: recipe.likesCount + 1 };
    }
  }

  // Lưu / Bỏ lưu công thức
  async toggleSave(recipeId: string, userId: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new NotFoundException('Công thức không tồn tại');
    }

    const existing = await this.savedRecipeRepository.findOne({
      where: { recipeId, userId },
    });

    if (existing) {
      await this.savedRecipeRepository.remove(existing);
      await this.recipeRepository.decrement({ id: recipeId }, 'savesCount', 1);
      return { saved: false, savesCount: Math.max(0, recipe.savesCount - 1) };
    } else {
      const savedItem = this.savedRecipeRepository.create({ recipeId, userId });
      await this.savedRecipeRepository.save(savedItem);
      await this.recipeRepository.increment({ id: recipeId }, 'savesCount', 1);
      return { saved: true, savesCount: recipe.savesCount + 1 };
    }
  }

  // Lấy các món thịnh hành (Trending)
  async getTrending(limit = 8) {
    return this.recipeRepository.find({
      where: { isPublished: true },
      relations: ['author'],
      order: { likesCount: 'DESC', viewsCount: 'DESC' },
      take: limit,
    });
  }

  // Lấy các món mới nhất
  async getLatest(limit = 8) {
    return this.recipeRepository.find({
      where: { isPublished: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Tủ lạnh thông minh (Smart Fridge) - Tìm món theo nguyên liệu sẵn có
  async findByIngredients(dto: SmartFridgeDto) {
    const { ingredients } = dto;
    if (!ingredients || ingredients.length === 0) {
      return [];
    }

    const allRecipes = await this.recipeRepository.find({
      where: { isPublished: true },
      relations: ['author'],
    });

    const scored = allRecipes.map((recipe) => {
      let matchedCount = 0;
      const lowerIngs = (recipe.ingredients || '').toLowerCase();
      const lowerTitle = recipe.title.toLowerCase();

      for (const ing of ingredients) {
        const cleanIng = ing.trim().toLowerCase();
        if (cleanIng && (lowerIngs.includes(cleanIng) || lowerTitle.includes(cleanIng))) {
          matchedCount += 1;
        }
      }

      const matchPercent = Math.round((matchedCount / ingredients.length) * 100);
      return {
        ...recipe,
        matchedCount,
        matchPercent,
      };
    });

    // Lọc các món có ít nhất 1 nguyên liệu khớp và sắp xếp giảm dần theo độ khớp
    return scored
      .filter((r) => r.matchedCount > 0)
      .sort((a, b) => b.matchedCount - a.matchedCount || b.likesCount - a.likesCount);
  }
}
