import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateEquipmentDTO } from './dtos/create-equipment.dto';
import { UpdateEquipmentDTO } from './dtos/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentRepository {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  findEquipments(): Promise<Equipment[]> {
    return this.equipmentRepository.find();
  }

  findEquipmentById(id: string): Promise<Equipment> {
    return this.equipmentRepository.findOne({
      id,
    });
  }

  findEquipmentsbyIds(ids: string[]): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      id: In(ids),
    });
  }

  findEquipmentByName(name: string): Promise<Equipment> {
    return this.equipmentRepository.findOne({
      name,
    });
  }

  createEquipment(createEquipmentDTO: CreateEquipmentDTO): Promise<Equipment> {
    const equipment = this.equipmentRepository.create(createEquipmentDTO);

    return this.equipmentRepository.save(equipment);
  }

  updateEquipment(
    equipment: Equipment,
    updateEquipmentDTO: UpdateEquipmentDTO,
  ): Promise<Equipment> {
    for (const prop in updateEquipmentDTO) {
      equipment[prop] = updateEquipmentDTO[prop];
    }
    return this.equipmentRepository.save(equipment);
  }

  deleteEquipment(equipment: Equipment): Promise<Equipment> {
    return this.equipmentRepository.remove(equipment);
  }
}
