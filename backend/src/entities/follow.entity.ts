// Entity theo dõi người dùng - Follow/Unfollow
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

@Entity('follows')
@Unique(['followerId', 'followingId']) // Không theo dõi trùng lặp
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  followedAt: Date;

  // Người đang theo dõi (người thực hiện hành động follow)
  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @Column()
  followerId: string;

  // Người được theo dõi
  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following: User;

  @Column()
  followingId: string;
}
