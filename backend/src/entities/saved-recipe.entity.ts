// Entity lưu công thức - Bookmark/Save recipes
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

@Entity('saved_recipes')
@Unique(['userId', 'recipeId']) // Mỗi người chỉ lưu một công thức một lần
export class SavedRecipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  savedAt: Date;

  // Quan hệ: Người lưu
  @ManyToOne(() => User, (user) => user.savedRecipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // Quan hệ: Công thức được lưu
  @ManyToOne(() => Recipe, (recipe) => recipe.savedBy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: string;
}
