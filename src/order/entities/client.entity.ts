import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Order } from './order.entity';

@Entity('clients')
export class Client {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  cpf: string;

  @Column()
  phone_number: string;

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];

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
