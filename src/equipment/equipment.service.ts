import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEquipmentDTO } from './dtos/create-equipment.dto';
import { UpdateEquipmentDTO } from './dtos/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { EquipmentRepository } from './equipment.repository';
import { StorageRepository } from './storage.repository';

@Injectable()
export class EquipmentService {
  constructor(
    @Inject('EQUIPMENT_REPOSITORY')
    private readonly equipmentRepository: EquipmentRepository,
    @Inject('STORAGE_REPOSITORY')
    private readonly storageRepository: StorageRepository,
  ) {}

  getEquipmentById(id: string): Promise<Equipment> {
    return this.equipmentRepository.findEquipmentById(id);
  }

  getAllEquipments(): Promise<Equipment[]> {
    return this.equipmentRepository.findEquipments();
  }

  async createNewEquipment(
    createEquipmentDTO: CreateEquipmentDTO,
  ): Promise<Equipment> {
    const { name, quantity } = createEquipmentDTO;

    const equipmentWithNameAlreadyExists =
      await this.equipmentRepository.findEquipmentByName(name);

    if (equipmentWithNameAlreadyExists) {
      throw new BadRequestException(
        `Equipment with name "${name}" already exists`,
      );
    }

    const equipment = await this.equipmentRepository.createEquipment(
      createEquipmentDTO,
    );

    await this.storageRepository.insertEquipmentInStorage({
      equipment_id: equipment.id,
      quantity,
    });

    return equipment;
  }

  async updateEquipment(
    id: string,
    updateEquipmentDTO: UpdateEquipmentDTO,
  ): Promise<Equipment> {
    const { name } = updateEquipmentDTO;

    const foundEquipment = await this.equipmentRepository.findEquipmentById(id);

    if (!foundEquipment) {
      throw new NotFoundException(`Equipment with ID "${id}" does not exist`);
    }

    if (name) {
      const equipmentWithNameAlreadyExists =
        await this.equipmentRepository.findEquipmentByName(name);

      if (
        equipmentWithNameAlreadyExists &&
        equipmentWithNameAlreadyExists.id !== id
      ) {
        throw new BadRequestException(
          `Equipment with name "${name}" already exists`,
        );
      }
    }

    return this.equipmentRepository.updateEquipment(
      foundEquipment,
      updateEquipmentDTO,
    );
  }

  async deleteEquipment(id: string): Promise<void> {
    const foundEquipment = await this.equipmentRepository.findEquipmentById(id);

    if (!foundEquipment) {
      throw new NotFoundException(`Equipment with ID "${id}" does not exist`);
    }

    await this.equipmentRepository.deleteEquipment(foundEquipment);
  }
}
