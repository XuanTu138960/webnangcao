// Entity bình luận - Hỗ trợ nested replies và đánh giá sao
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
import { Recipe } from './recipe.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nội dung bình luận
  @Column({ type: 'text' })
  content: string;

  // Đánh giá sao (1-5), null nếu là reply
  @Column({ nullable: true })
  rating: number;

  // Trạng thái hiển thị
  @Column({ default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Quan hệ: Thuộc về một công thức
  @ManyToOne(() => Recipe, (recipe) => recipe.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: string;

  // Quan hệ: Người viết bình luận
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  // Quan hệ: Bình luận cha (hỗ trợ nested replies)
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @Column({ nullable: true })
  parentId: string;

  // Quan hệ: Các bình luận con (replies)
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];
}
