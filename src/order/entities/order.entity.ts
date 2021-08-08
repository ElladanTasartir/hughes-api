import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { OrderStatus } from '../enums/order-status.enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  client_id: string;

  @Column()
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
