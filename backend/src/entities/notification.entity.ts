// Entity thông báo - Notifications system
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

// Các loại thông báo trong hệ thống
export enum NotificationType {
  LIKE = 'like',           // Ai đó thích công thức của bạn
  COMMENT = 'comment',     // Ai đó bình luận về công thức của bạn
  REPLY = 'reply',         // Ai đó trả lời bình luận của bạn
  FOLLOW = 'follow',       // Ai đó theo dõi bạn
  COOKSNAP = 'cooksnap',   // Ai đó nấu theo công thức của bạn
  SAVE = 'save',           // Ai đó lưu công thức của bạn
  NEW_RECIPE = 'new_recipe', // Người bạn theo dõi đăng công thức mới
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Loại thông báo
  @Column({ type: 'text' })
  type: NotificationType;

  // Nội dung thông báo
  @Column({ type: 'text' })
  message: string;

  // ID tham chiếu (recipeId, commentId, userId tùy loại thông báo)
  @Column({ nullable: true })
  referenceId: string;

  // Loại tham chiếu (recipe, comment, user)
  @Column({ nullable: true })
  referenceType: string;

  // Trạng thái đã đọc
  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Quan hệ: Người nhận thông báo
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  recipientId: string;

  // Quan hệ: Người thực hiện hành động tạo thông báo
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'actorId' })
  actor: User;

  @Column({ nullable: true })
  actorId: string;
}
