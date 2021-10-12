import { OrderEquipments } from '../../order/entities/order_equipment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('equipments')
export class Equipment {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  manufacturer: string;

  @Column({ type: 'numeric' })
  price: string;

  @OneToMany(
    () => OrderEquipments,
    (OrderEquipments) => OrderEquipments.equipment,
  )
  equipments_order: OrderEquipments[];

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
