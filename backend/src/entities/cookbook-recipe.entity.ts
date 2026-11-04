// Entity quan hệ giữa bộ sưu tập và công thức
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { Cookbook } from './cookbook.entity';
import { Recipe } from './recipe.entity';

@Entity('cookbook_recipes')
@Unique(['cookbookId', 'recipeId']) // Mỗi công thức chỉ xuất hiện một lần trong bộ sưu tập
export class CookbookRecipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Thứ tự sắp xếp trong bộ sưu tập
  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  addedAt: Date;

  // Quan hệ: Thuộc về bộ sưu tập nào
  @ManyToOne(() => Cookbook, (cookbook) => cookbook.cookbookRecipes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cookbookId' })
  cookbook: Cookbook;

  @Column()
  cookbookId: string;

  // Quan hệ: Công thức nào được thêm
  @ManyToOne(() => Recipe, (recipe) => recipe.cookbookEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: string;
}
