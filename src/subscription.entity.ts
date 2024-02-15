import { Entity, PrimaryGeneratedColumn,Column, ManyToOne } from 'typeorm';
import { Magazine } from './magazine.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer'})
  userId: number;

  @ManyToOne(() => Magazine, magazine => magazine.subscriptions)
  magazine: Magazine;
}
