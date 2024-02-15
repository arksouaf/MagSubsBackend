import { Controller, Post, Delete, Param, NotFoundException } from '@nestjs/common';
import { MagazineService } from './magazine.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly MagazineService: MagazineService) {}

  @Post(':userId/:magazineId')
  async subscribeToMagazine(
    @Param('userId') userId: number,
    @Param('magazineId') magazineId: number,
  ): Promise<boolean> {
    await this.MagazineService.subscribeToMagazine(userId, magazineId);
    return true;
  }

  @Delete(':userId/:magazineId')
  async cancelSubscription(
    @Param('userId') userId: number,
    @Param('magazineId') magazineId: number,
  ): Promise<boolean> {
    const result = await this.MagazineService.cancelSubscription(userId, magazineId);
    return true
  }
}
