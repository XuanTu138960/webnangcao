import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Recipe } from './recipe.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  ratingStar: number;

  @Column('text')
  comment: string;

  @Column({ nullable: true })
  attachmentUrl: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @CreateDateColumn()
  createdAt: Date;
}
