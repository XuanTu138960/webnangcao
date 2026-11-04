import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Recipe, (recipe) => recipe.category)
  recipes: Recipe[];
}
