import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Magazine } from './magazine.entity';
import { Subscription } from './subscription.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(Magazine)
    private magazineRepository: Repository<Magazine>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Magazine[]> {
    return this.magazineRepository.find();
  }

  async findOne(id: number): Promise<Magazine | undefined> {
    return this.magazineRepository.findOne({ where: { id } });
  }  

  async create(magazineData: Partial<Magazine>): Promise<Magazine> {
    const magazine = this.magazineRepository.create(magazineData);
    return this.magazineRepository.save(magazine);
  }

  async update(id: number, magazineData: Partial<Magazine>): Promise<Magazine> {
    await this.magazineRepository.update(id, magazineData);
    return this.magazineRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.magazineRepository.delete(id);
  }

  async subscribeToMagazine(userId: number, magazineId: number): Promise<Subscription> {
    const magazine = await this.magazineRepository.findOne({where : {id:magazineId}});
    if (!magazine) {
      throw new NotFoundException('Magazine not found');
    }

    const subscription = new Subscription();
    subscription.userId = userId;
    subscription.magazine = magazine;

    return this.subscriptionRepository.save(subscription);
  }

  async cancelSubscription(userId: number, magazineId: number): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({  where: { userId, magazine: { id: magazineId } } });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.subscriptionRepository.remove(subscription);
  }
}
  
