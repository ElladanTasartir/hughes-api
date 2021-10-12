import { Equipment } from '../../equipment/entities/equipment.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_equipments')
export class OrderEquipments {
  @PrimaryColumn()
  equipment_id: string;

  @PrimaryColumn()
  order_id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.order_equipments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Equipment, (equipment) => equipment.equipments_order)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;
}
