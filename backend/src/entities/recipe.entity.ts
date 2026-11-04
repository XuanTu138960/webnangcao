// Entity công thức nấu ăn - Bảng recipes trong SQLite
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { SavedRecipe } from './saved-recipe.entity';
import { RecipeLike } from './recipe-like.entity';
import { CookbookRecipe } from './cookbook-recipe.entity';

// Phân loại món ăn theo cách chế biến
export enum RecipeCategory {
  MON_XAO = 'Món xào',
  MON_CHIEN = 'Món chiên',
  MON_KHO = 'Món kho',
  MON_CANH = 'Món canh',
  MON_HAP = 'Món hấp',
  MON_CHAY = 'Món chay',
  MON_CHINH = 'Món chính',
  MON_TRANG_MIENG = 'Món tráng miệng',
  MON_NUOC = 'Món nước',
  BANH = 'Bánh',
}

// Độ khó của món ăn
export enum DifficultyLevel {
  DE = 'Dễ',
  TRUNG_BINH = 'Trung bình',
  KHO = 'Khó',
}

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tên món ăn
  @Column({ length: 200 })
  title: string;

  // Mô tả ngắn gọn về món ăn
  @Column({ type: 'text' })
  description: string;

  // Hình ảnh đại diện món ăn
  @Column({ nullable: true })
  thumbnail: string;

  // Danh mục món ăn
  @Column({ type: 'text', default: RecipeCategory.MON_CHINH })
  category: RecipeCategory;

  // Nguyên liệu dưới dạng JSON: [{name, amount, unit}]
  @Column({ type: 'text' })
  ingredients: string; // Lưu dưới dạng JSON string

  // Các bước thực hiện dưới dạng JSON: [{step, description, image?}]
  @Column({ type: 'text' })
  instructions: string; // Lưu dưới dạng JSON string

  // Thời gian chuẩn bị (phút)
  @Column({ default: 0 })
  prepTime: number;

  // Thời gian nấu (phút)
  @Column({ default: 0 })
  cookTime: number;

  // Khẩu phần ăn (mặc định)
  @Column({ default: 2 })
  servings: number;

  // Độ khó
  @Column({ type: 'text', default: DifficultyLevel.TRUNG_BINH })
  difficulty: DifficultyLevel;

  // Nhãn chế độ ăn: chay, thuần chay, không gluten... (JSON array)
  @Column({ type: 'text', nullable: true })
  dietaryTags: string; // JSON array string

  // Calories mỗi khẩu phần
  @Column({ nullable: true })
  calories: number;

  // Điểm đánh giá trung bình
  @Column({ type: 'real', default: 0 })
  averageRating: number;

  // Tổng số lượt đánh giá
  @Column({ default: 0 })
  ratingCount: number;

  // Tổng số lượt thích
  @Column({ default: 0 })
  likesCount: number;

  // Tổng số lượt lưu
  @Column({ default: 0 })
  savesCount: number;

  // Tổng số lượt xem
  @Column({ default: 0 })
  viewsCount: number;

  // Tổng số bình luận
  @Column({ default: 0 })
  commentsCount: number;

  // Trạng thái công bố
  @Column({ default: true })
  isPublished: boolean;

  // Công thức nổi bật (admin gắn tag)
  @Column({ default: false })
  isFeatured: boolean;

  // Video hướng dẫn (URL)
  @Column({ nullable: true })
  videoUrl: string;

  // Nguồn gốc/xuất xứ món ăn
  @Column({ nullable: true, length: 100 })
  origin: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Quan hệ: Thuộc về một tác giả
  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  // Quan hệ: Có nhiều bình luận
  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: Comment[];

  // Quan hệ: Được lưu bởi nhiều người dùng
  @OneToMany(() => SavedRecipe, (saved) => saved.recipe)
  savedBy: SavedRecipe[];

  // Quan hệ: Được thích bởi nhiều người dùng
  @OneToMany(() => RecipeLike, (like) => like.recipe)
  likedBy: RecipeLike[];

  // Quan hệ: Thuộc về nhiều bộ sưu tập
  @OneToMany(() => CookbookRecipe, (cr) => cr.recipe)
  cookbookEntries: CookbookRecipe[];
}
