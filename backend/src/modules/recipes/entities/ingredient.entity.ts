import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  quantity: number;

  @Column()
  unit: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
