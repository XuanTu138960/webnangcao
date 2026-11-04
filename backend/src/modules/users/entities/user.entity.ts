import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { Bookmark } from '../../recipes/entities/bookmark.entity';

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Không bao giờ lộ password hash ra ngoài API
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Recipe, (recipe) => recipe.author)
  recipes: Recipe[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
