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
import { User } from '../../users/entities/user.entity';
import { Category } from './category.entity';
import { Ingredient } from './ingredient.entity';
import { CookingStep } from './cooking-step.entity';
import { Review } from './review.entity';
import { Bookmark } from './bookmark.entity';

export enum RecipeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('int', { default: 2 })
  servingSize: number;

  @Column('int', { default: 15 })
  prepTimeMinutes: number;

  @Column('int', { default: 30 })
  cookTimeMinutes: number;

  @Column({ default: 'Dễ' })
  difficultyLevel: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({
    type: 'varchar',
    default: RecipeStatus.PENDING,
  })
  status: RecipeStatus;

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Category, (category) => category.recipes, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, { cascade: true })
  ingredients: Ingredient[];

  @OneToMany(() => CookingStep, (step) => step.recipe, { cascade: true })
  steps: CookingStep[];

  @OneToMany(() => Review, (review) => review.recipe)
  reviews: Review[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.recipe)
  bookmarks: Bookmark[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
