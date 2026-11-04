import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  // Lấy danh sách thông báo của người dùng
  async getUserNotifications(userId: string, limit = 20) {
    const items = await this.notificationRepository.find({
      where: { recipientId: userId },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const unreadCount = await this.notificationRepository.count({
      where: { recipientId: userId, isRead: false },
    });

    return {
      notifications: items,
      unreadCount,
    };
  }

  // Đánh dấu 1 thông báo là đã đọc
  async markAsRead(id: string, userId: string) {
    await this.notificationRepository.update(
      { id, recipientId: userId },
      { isRead: true },
    );
    return { success: true };
  }

  // Đánh dấu tất cả là đã đọc
  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { recipientId: userId, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }
}
