// Service quản lý người dùng - Profile, Follow, Saved, Liked
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Follow } from '../../entities/follow.entity';
import { Recipe } from '../../entities/recipe.entity';
import { SavedRecipe } from '../../entities/saved-recipe.entity';
import { RecipeLike } from '../../entities/recipe-like.entity';
import { Notification, NotificationType } from '../../entities/notification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(SavedRecipe)
    private readonly savedRecipeRepository: Repository<SavedRecipe>,
    @InjectRepository(RecipeLike)
    private readonly recipeLikeRepository: Repository<RecipeLike>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  // Lấy thông tin profile theo username
  async getUserProfile(username: string, currentUserId?: string) {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng "${username}"`);
    }

    // Kiểm tra xem currentUser có đang follow user này không
    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      const follow = await this.followRepository.findOne({
        where: { followerId: currentUserId, followingId: user.id },
      });
      isFollowing = !!follow;
    }

    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, isFollowing };
  }

  // Cập nhật thông tin profile
  async updateProfile(
    userId: string,
    updateData: { fullName?: string; bio?: string; avatar?: string },
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);
    const { password, ...result } = updatedUser;
    return result;
  }

  // Theo dõi người dùng
  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Bạn không thể tự theo dõi chính mình');
    }

    const targetUser = await this.userRepository.findOne({
      where: { id: followingId },
    });
    if (!targetUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Kiểm tra đã theo dõi chưa
    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    if (existingFollow) {
      throw new ConflictException('Bạn đã theo dõi người dùng này rồi');
    }

    // Tạo follow
    const follow = this.followRepository.create({ followerId, followingId });
    await this.followRepository.save(follow);

    // Cập nhật số lượng
    await this.userRepository.increment({ id: followerId }, 'followingCount', 1);
    await this.userRepository.increment({ id: followingId }, 'followersCount', 1);

    // Tạo thông báo
    await this.notificationRepository.save(
      this.notificationRepository.create({
        type: NotificationType.FOLLOW,
        message: 'đã bắt đầu theo dõi bạn',
        recipientId: followingId,
        actorId: followerId,
        referenceId: followerId,
        referenceType: 'user',
      }),
    );

    return { message: `Đã theo dõi ${targetUser.fullName}`, isFollowing: true };
  }

  // Bỏ theo dõi người dùng
  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      throw new NotFoundException('Bạn chưa theo dõi người dùng này');
    }

    await this.followRepository.remove(follow);

    // Cập nhật số lượng
    await this.userRepository.decrement({ id: followerId }, 'followingCount', 1);
    await this.userRepository.decrement({ id: followingId }, 'followersCount', 1);

    return { message: 'Đã bỏ theo dõi', isFollowing: false };
  }

  // Lấy danh sách người theo dõi
  async getFollowers(userId: string, page = 1, limit = 20) {
    const [follows, total] = await this.followRepository.findAndCount({
      where: { followingId: userId },
      relations: ['follower'],
      order: { followedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: follows.map((f) => {
        const { password, ...user } = f.follower;
        return user;
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy danh sách đang theo dõi
  async getFollowing(userId: string, page = 1, limit = 20) {
    const [follows, total] = await this.followRepository.findAndCount({
      where: { followerId: userId },
      relations: ['following'],
      order: { followedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: follows.map((f) => {
        const { password, ...user } = f.following;
        return user;
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy công thức đã lưu của người dùng
  async getSavedRecipes(userId: string, page = 1, limit = 12) {
    const [saved, total] = await this.savedRecipeRepository.findAndCount({
      where: { userId },
      relations: ['recipe', 'recipe.author'],
      order: { savedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: saved.map((s) => s.recipe),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy công thức đã thích của người dùng
  async getLikedRecipes(userId: string, page = 1, limit = 12) {
    const [liked, total] = await this.recipeLikeRepository.findAndCount({
      where: { userId },
      relations: ['recipe', 'recipe.author'],
      order: { likedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: liked.map((l) => l.recipe),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy công thức của người dùng
  async getUserRecipes(username: string, page = 1, limit = 12) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const [recipes, total] = await this.recipeRepository.findAndCount({
      where: { authorId: user.id, isPublished: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: recipes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Tìm kiếm người dùng
  async searchUsers(query: string, page = 1, limit = 10) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere(
        '(user.fullName LIKE :query OR user.username LIKE :query)',
        { query: `%${query}%` },
      )
      .select(['user.id', 'user.fullName', 'user.username', 'user.avatar', 'user.bio', 'user.followersCount', 'user.recipesCount'])
      .orderBy('user.followersCount', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }
}
