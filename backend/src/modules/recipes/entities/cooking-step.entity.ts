import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('cooking_steps')
export class CookingStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  stepNumber: number;

  @Column('text')
  instruction: string;

  @Column({ nullable: true })
  imageAttachment: string;

  @Column({ type: 'int', default: 5 })
  durationMinutes: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
