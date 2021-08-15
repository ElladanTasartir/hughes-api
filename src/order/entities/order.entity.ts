import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @ManyToOne(() => Client, (client) => client.orders)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  plan_id: string;

  @ManyToOne(() => Plan, (plan) => plan.id)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

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
