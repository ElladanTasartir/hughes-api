import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InsertEquipmentInStorageDTO } from './dtos/insert-equipment-in-storage.dto';
import { Storage } from './entities/storage.entity';
import { EquipmentService } from './equipment.service';
import { StorageRepository } from './storage.repository';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_REPOSITORY')
    private readonly storageRepository: StorageRepository,
    private readonly equipmentService: EquipmentService,
  ) {}

  listAllStoragedEquipments(): Promise<Storage[]> {
    return this.storageRepository.listAllStoragedEquipments();
  }

  async updateStoragedEquipment(
    id: string,
    quantity: number,
  ): Promise<Storage> {
    const storageFound = await this.storageRepository.findStorageById(id);

    if (!storageFound) {
      throw new NotFoundException(`Storage with ID "${id}" not found`);
    }

    if (quantity === storageFound.quantity) {
      return storageFound;
    }

    return this.storageRepository.changeStorageQuantity(storageFound, quantity);
  }

  async insertEquipmentInStorage(
    insertEquipmentInStorageDTO: InsertEquipmentInStorageDTO,
  ): Promise<Storage> {
    const { equipment_id } = insertEquipmentInStorageDTO;

    const equipment = await this.equipmentService.getEquipmentById(
      equipment_id,
    );

    if (!equipment) {
      throw new NotFoundException(
        `Equipment with ID "${equipment_id}" not found`,
      );
    }

    const equipmentIsInStorage =
      await this.storageRepository.findEquipmentInStorage(equipment_id);

    if (equipmentIsInStorage) {
      throw new BadRequestException(
        `Equipment with ID ${equipment_id} is already in storage`,
      );
    }

    return this.storageRepository.insertEquipmentInStorage(
      insertEquipmentInStorageDTO,
    );
  }
}
