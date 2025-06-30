import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as webpush from 'web-push';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async notifyAllUsers(message: string) {
    const users = await this.prisma.user.findMany({
      where: { role: { in: ['admin', 'owner'] } },
      select: { id: true, pushSubscription: true },
    });

    for (const user of users) {
      if (!user.pushSubscription || user.pushSubscription === 'no-subscription') continue;

      try {
        const sub = JSON.parse(user.pushSubscription);
        await webpush.sendNotification(
          sub,
          JSON.stringify({
            title: 'Bildirishnoma',
            message,
          }),
        );
      } catch (err) {
        console.error('Push notification error:', err);
      }
    }

    await this.prisma.notification.createMany({
      data: users.map(user => ({
        userId: user.id,
        message,
        isRead: false,
      })),
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
