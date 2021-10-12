import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { Storage } from './entities/storage.entity';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { equipmentRepository } from './providers/repositories';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment, Storage])],
  controllers: [EquipmentController, StorageController],
  providers: [EquipmentService, StorageService, ...equipmentRepository],
  exports: [EquipmentService],
})
export class EquipmentModule {}
