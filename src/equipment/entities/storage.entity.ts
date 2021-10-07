import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Equipment } from './equipment.entity';

@Entity('storage')
export class Storage {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'int4' })
  quantity: number;

  @Column()
  equipment_id: string;

  @OneToOne(() => Equipment, (equipment) => equipment.id)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @Column({ type: 'timestamptz' })
  last_move: Date;

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
