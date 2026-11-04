// Entity bộ sưu tập công thức - Cookbooks
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
import { CookbookRecipe } from './cookbook-recipe.entity';

@Entity('cookbooks')
export class Cookbook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tên bộ sưu tập
  @Column({ length: 100 })
  name: string;

  // Mô tả bộ sưu tập
  @Column({ type: 'text', nullable: true })
  description: string;

  // Hình ảnh bìa
  @Column({ nullable: true })
  coverImage: string;

  // Công khai hay riêng tư
  @Column({ default: true })
  isPublic: boolean;

  // Số lượng công thức
  @Column({ default: 0 })
  recipesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Quan hệ: Thuộc về một người dùng
  @ManyToOne(() => User, (user) => user.cookbooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  // Quan hệ: Chứa nhiều công thức
  @OneToMany(() => CookbookRecipe, (cr) => cr.cookbook)
  cookbookRecipes: CookbookRecipe[];
}
