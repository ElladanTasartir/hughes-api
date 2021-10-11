import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertEquipmentInStorageDTO } from './dtos/insert-equipment-in-storage.dto';
import { Storage } from './entities/storage.entity';

@Injectable()
export class StorageRepository {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}

  listAllStoragedEquipments(): Promise<Storage[]> {
    return this.storageRepository.find({
      relations: ['equipment'],
    });
  }

  async insertEquipmentInStorage(
    insertEquipmentInStorageDTO: InsertEquipmentInStorageDTO,
  ): Promise<Storage> {
    const storagedEquipment = this.storageRepository.create({
      ...insertEquipmentInStorageDTO,
      last_move: new Date(),
    });

    await this.storageRepository.save(storagedEquipment);

    return this.storageRepository.findOne(storagedEquipment.id, {
      relations: ['equipment'],
    });
  }

  findEquipmentInStorage(id: string): Promise<Storage> {
    return this.storageRepository.findOne({
      where: {
        equipment_id: id,
      },
    });
  }

  findStorageById(id: string): Promise<Storage> {
    return this.storageRepository.findOne(id);
  }

  changeStorageQuantity(storage: Storage, quantity: number): Promise<Storage> {
    storage.quantity = quantity;
    storage.last_move = new Date();

    return this.storageRepository.save(storage);
  }
}
