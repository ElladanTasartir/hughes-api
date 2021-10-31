import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEquipmentDTO } from './dtos/create-equipment.dto';
import { UpdateEquipmentDTO } from './dtos/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { EquipmentRepository } from './equipment.repository';
import { StorageRepository } from './storage.repository';
import { SetOrderInProgressDTO } from '../order/dtos/set-order-in-progress.dto';

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

  async getEquipmentsById(ids: string[]): Promise<Equipment[]> {
    const equipments = await this.equipmentRepository.findEquipmentsbyIds(ids);

    const idsWithoutAnEquipment = ids
      .map((id) => {
        const idIsInEquipments = equipments.find(
          (equipment) => equipment.id === id,
        );

        if (idIsInEquipments) {
          return;
        }

        return id;
      })
      .filter(Boolean);

    if (idsWithoutAnEquipment.length) {
      throw new BadRequestException(
        `Equipments "${idsWithoutAnEquipment.join(',')}" do not exist`,
      );
    }

    return equipments;
  }

  async takeFromStorage(
    setOrderInProgressDTO: SetOrderInProgressDTO,
  ): Promise<void> {
    const { equipments } = setOrderInProgressDTO;

    const storagedEquipments =
      await this.storageRepository.findStoragedEquipmentsByIds(
        equipments.map((equipment) => equipment.equipment_id),
      );

    for (const equipment of storagedEquipments) {
      const equipmentFound = equipments.find(
        (newEquipments) =>
          equipment.equipment_id === newEquipments.equipment_id,
      );

      if (!equipmentFound) {
        throw new BadRequestException(
          `Equipment with ID "${equipment.id}" not found`,
        );
      }

      if (equipment.quantity < equipmentFound.quantity) {
        throw new UnprocessableEntityException(
          `Can't take more equipments from equipment ID "${equipment.equipment_id}" than storaged (${equipment.quantity})`,
        );
      }
    }

    await Promise.all(
      storagedEquipments.map(async (equipment) => {
        const foundEquipment = equipments.find(
          (newEquipment) =>
            newEquipment.equipment_id === equipment.equipment_id,
        );
        console.log(foundEquipment);
        if (!foundEquipment) {
          return;
        }

        const newQuantity = equipment.quantity - foundEquipment.quantity;

        return this.storageRepository.changeStorageQuantity(
          equipment,
          newQuantity,
        );
      }),
    );

    return;
  }

  async replenishStorage(
    equipment_id: string,
    quantity: number,
  ): Promise<void> {
    const foundStoragedEquipment =
      await this.storageRepository.findEquipmentInStorage(equipment_id);

    if (!foundStoragedEquipment) {
      throw new NotFoundException(
        `Storaged Equipment with ID "${equipment_id}" not found`,
      );
    }

    const newQuantity = foundStoragedEquipment.quantity + quantity;

    await this.storageRepository.changeStorageQuantity(
      foundStoragedEquipment,
      newQuantity,
    );
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
