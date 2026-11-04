import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cookbook } from '../../entities/cookbook.entity';
import { CookbookRecipe } from '../../entities/cookbook-recipe.entity';
import { Recipe } from '../../entities/recipe.entity';

@Injectable()
export class CookbooksService {
  constructor(
    @InjectRepository(Cookbook)
    private readonly cookbookRepository: Repository<Cookbook>,
    @InjectRepository(CookbookRecipe)
    private readonly cookbookRecipeRepository: Repository<CookbookRecipe>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  // Lấy danh sách bộ sưu tập của người dùng
  async getUserCookbooks(userId: string) {
    return this.cookbookRepository.find({
      where: { ownerId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy chi tiết bộ sưu tập kèm các công thức
  async getCookbookDetails(id: string) {
    const cookbook = await this.cookbookRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!cookbook) {
      throw new NotFoundException('Không tìm thấy bộ sưu tập');
    }

    const items = await this.cookbookRecipeRepository.find({
      where: { cookbookId: id },
      relations: ['recipe', 'recipe.author'],
      order: { sortOrder: 'ASC' },
    });

    return {
      ...cookbook,
      recipes: items.map((i) => i.recipe),
    };
  }

  // Tạo bộ sưu tập mới
  async createCookbook(
    userId: string,
    data: { name: string; description?: string; coverImage?: string },
  ) {
    const cookbook = this.cookbookRepository.create({
      ...data,
      ownerId: userId,
    });
    return this.cookbookRepository.save(cookbook);
  }

  // Thêm công thức vào bộ sưu tập
  async addRecipeToCookbook(cookbookId: string, recipeId: string, userId: string) {
    const cookbook = await this.cookbookRepository.findOne({
      where: { id: cookbookId },
    });

    if (!cookbook) {
      throw new NotFoundException('Bộ sưu tập không tồn tại');
    }

    if (cookbook.ownerId !== userId) {
      throw new ForbiddenException('Bạn không sở hữu bộ sưu tập này');
    }

    const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new NotFoundException('Công thức không tồn tại');
    }

    const exists = await this.cookbookRecipeRepository.findOne({
      where: { cookbookId, recipeId },
    });

    if (exists) {
      throw new ConflictException('Công thức đã có trong bộ sưu tập này');
    }

    const item = this.cookbookRecipeRepository.create({ cookbookId, recipeId });
    await this.cookbookRecipeRepository.save(item);
    await this.cookbookRepository.increment({ id: cookbookId }, 'recipesCount', 1);

    return { success: true, message: 'Đã thêm vào bộ sưu tập' };
  }

  // Xóa công thức khỏi bộ sưu tập
  async removeRecipeFromCookbook(
    cookbookId: string,
    recipeId: string,
    userId: string,
  ) {
    const cookbook = await this.cookbookRepository.findOne({
      where: { id: cookbookId },
    });

    if (!cookbook || cookbook.ownerId !== userId) {
      throw new ForbiddenException('Không có quyền thao tác trên bộ sưu tập này');
    }

    const item = await this.cookbookRecipeRepository.findOne({
      where: { cookbookId, recipeId },
    });

    if (item) {
      await this.cookbookRecipeRepository.remove(item);
      await this.cookbookRepository.decrement({ id: cookbookId }, 'recipesCount', 1);
    }

    return { success: true, message: 'Đã xóa công thức khỏi bộ sưu tập' };
  }

  // Xóa bộ sưu tập
  async deleteCookbook(id: string, userId: string) {
    const cookbook = await this.cookbookRepository.findOne({ where: { id } });
    if (!cookbook || cookbook.ownerId !== userId) {
      throw new ForbiddenException('Không có quyền xóa bộ sưu tập này');
    }
    await this.cookbookRepository.remove(cookbook);
    return { success: true, message: 'Đã xóa bộ sưu tập' };
  }
}
