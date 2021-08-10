import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { OrderStatus } from '../enums/order-status.enum';
import { Plan } from '../../plan/entities/plan.entity';
import { Client } from './client.entity';

@Entity('orders')
export class Order {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Client)
  client: Client;

  @Column()
  @ManyToOne(() => Plan)
  plan_id: string;

  @Column()
  status: OrderStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
