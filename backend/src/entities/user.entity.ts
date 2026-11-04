// Entity người dùng - Bảng users trong SQLite
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { Comment } from './comment.entity';
import { SavedRecipe } from './saved-recipe.entity';
import { RecipeLike } from './recipe-like.entity';
import { Follow } from './follow.entity';
import { Cookbook } from './cookbook.entity';
import { Notification } from './notification.entity';

// Vai trò người dùng trong hệ thống
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tên hiển thị của người dùng
  @Column({ length: 100 })
  fullName: string;

  // Tên đăng nhập duy nhất
  @Column({ unique: true, length: 50 })
  username: string;

  // Email duy nhất
  @Column({ unique: true })
  email: string;

  // Mật khẩu đã được mã hóa bcrypt
  @Column()
  password: string;

  // Ảnh đại diện
  @Column({ nullable: true })
  avatar: string;

  // Tiểu sử cá nhân
  @Column({ type: 'text', nullable: true })
  bio: string;

  // Vai trò: user hoặc admin
  @Column({ type: 'text', default: UserRole.USER })
  role: UserRole;

  // Trạng thái hoạt động tài khoản
  @Column({ default: true })
  isActive: boolean;

  // Số lượng công thức đã tạo (cache)
  @Column({ default: 0 })
  recipesCount: number;

  // Số người theo dõi
  @Column({ default: 0 })
  followersCount: number;

  // Số người đang theo dõi
  @Column({ default: 0 })
  followingCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Quan hệ: Một người dùng có nhiều công thức
  @OneToMany(() => Recipe, (recipe) => recipe.author)
  recipes: Recipe[];

  // Quan hệ: Một người dùng có nhiều bình luận
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  // Quan hệ: Công thức đã lưu
  @OneToMany(() => SavedRecipe, (saved) => saved.user)
  savedRecipes: SavedRecipe[];

  // Quan hệ: Công thức đã thích
  @OneToMany(() => RecipeLike, (like) => like.user)
  likedRecipes: RecipeLike[];

  // Quan hệ: Người đang theo dõi
  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  // Quan hệ: Người theo dõi mình
  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  // Quan hệ: Bộ sưu tập công thức
  @OneToMany(() => Cookbook, (cookbook) => cookbook.owner)
  cookbooks: Cookbook[];

  // Quan hệ: Thông báo nhận được
  @OneToMany(() => Notification, (notif) => notif.recipient)
  notifications: Notification[];
}
