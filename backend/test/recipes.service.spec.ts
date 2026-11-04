import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipesService } from '../src/modules/recipes/recipes.service';
import { Recipe, RecipeCategory, DifficultyLevel } from '../src/entities/recipe.entity';
import { RecipeLike } from '../src/entities/recipe-like.entity';
import { SavedRecipe } from '../src/entities/saved-recipe.entity';
import { Notification } from '../src/entities/notification.entity';
import { User } from '../src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('RecipesService', () => {
  let service: RecipesService;
  let recipeRepo: any;

  const mockRecipe = {
    id: 'test-recipe-uuid',
    title: 'Phở bò Hà Nội truyền thống',
    description: 'Nước dùng trong vắt, thơm mùi quế hồi thảo quả',
    category: RecipeCategory.MON_NUOC,
    ingredients: 'Bánh phở\nThịt bò\nXương ống bò\nHành tây\nGừng',
    instructions: '1. Hầm xương bò 6 tiếng.\n2. Chần bánh phở.\n3. Xếp thịt bò và chan nước dùng.',
    prepTime: 30,
    cookTime: 180,
    servings: 4,
    difficulty: DifficultyLevel.TRUNG_BINH,
    likesCount: 15,
    viewsCount: 120,
    authorId: 'test-user-uuid',
    isPublished: true,
  };

  const mockRecipeRepository = {
    find: jest.fn().mockResolvedValue([mockRecipe]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === mockRecipe.id) return Promise.resolve(mockRecipe);
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((r) => Promise.resolve({ id: 'new-id', ...r })),
    increment: jest.fn().mockResolvedValue(true),
    decrement: jest.fn().mockResolvedValue(true),
    remove: jest.fn().mockResolvedValue(true),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockRecipe], 1]),
    })),
  };

  const mockRecipeLikeRepository = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(true),
    remove: jest.fn().mockResolvedValue(true),
  };

  const mockSavedRecipeRepository = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(true),
    remove: jest.fn().mockResolvedValue(true),
  };

  const mockNotificationRepository = {
    save: jest.fn().mockResolvedValue(true),
    create: jest.fn().mockImplementation((dto) => dto),
  };

  const mockUserRepository = {
    increment: jest.fn().mockResolvedValue(true),
    decrement: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository,
        },
        {
          provide: getRepositoryToken(RecipeLike),
          useValue: mockRecipeLikeRepository,
        },
        {
          provide: getRepositoryToken(SavedRecipe),
          useValue: mockSavedRecipeRepository,
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    recipeRepo = module.get(getRepositoryToken(Recipe));
  });

  it('nên được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('nên trả về thông tin chi tiết công thức khi ID hợp lệ', async () => {
      const result = await service.findOne('test-recipe-uuid');
      expect(result).toBeDefined();
      expect(result.title).toEqual('Phở bò Hà Nội truyền thống');
      expect(mockRecipeRepository.increment).toHaveBeenCalledWith(
        { id: 'test-recipe-uuid' },
        'viewsCount',
        1,
      );
    });

    it('nên ném lỗi NotFoundException khi ID không tồn tại', async () => {
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIngredients (Smart Fridge)', () => {
    it('nên gợi ý các món ăn chứa nguyên liệu có sẵn', async () => {
      const results = await service.findByIngredients({
        ingredients: ['thịt bò', 'hành tây'],
      });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].matchedCount).toBeGreaterThan(0);
    });

    it('nên trả về mảng rỗng nếu không có nguyên liệu truyền vào', async () => {
      const results = await service.findByIngredients({ ingredients: [] });
      expect(results).toEqual([]);
    });
  });

  describe('toggleLike', () => {
    it('nên thích công thức thành công khi chưa thích', async () => {
      const res = await service.toggleLike('test-recipe-uuid', 'user-123');
      expect(res.liked).toBe(true);
      expect(mockRecipeRepository.increment).toHaveBeenCalled();
    });
  });
});
