import { Provider } from '@nestjs/common';
import { EquipmentRepository } from '../equipment.repository';
import { StorageRepository } from '../storage.repository';

export const equipmentRepository = [
  {
    provide: 'EQUIPMENT_REPOSITORY',
    useClass: EquipmentRepository,
  },
  {
    provide: 'STORAGE_REPOSITORY',
    useClass: StorageRepository,
  },
] as Provider[];
