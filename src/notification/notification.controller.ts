import {
  Controller,
  Get,
  UseGuards,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guard/auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(@Req() req: Request) {
    const user = req['user'];
    return this.notificationService.getUserNotifications(user.id);
  }

  @Patch(':id/read')
  async markOneAsRead(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return this.notificationService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  async markAllRead(@Req() req: Request) {
    const user = req['user'];
    return this.notificationService.markAllAsRead(user.id);
  }
}
