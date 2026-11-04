// Entity lượt thích công thức - Like/Unlike recipes
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Recipe } from './recipe.entity';

@Entity('recipe_likes')
@Unique(['userId', 'recipeId']) // Mỗi người chỉ thích một công thức một lần
export class RecipeLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  likedAt: Date;

  // Quan hệ: Người thích
  @ManyToOne(() => User, (user) => user.likedRecipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // Quan hệ: Công thức được thích
  @ManyToOne(() => Recipe, (recipe) => recipe.likedBy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: string;
}
