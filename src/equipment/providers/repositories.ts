import { Provider } from '@nestjs/common';
import { EquipmentRepository } from '../equipment.repository';

export const equipmentRepository = [
  {
    provide: 'EQUIPMENT_REPOSITORY',
    useClass: EquipmentRepository,
  },
] as Provider[];
