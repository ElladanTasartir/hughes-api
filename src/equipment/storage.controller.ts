import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { GetAuthenticatedUser } from 'src/user/decorators/auth.decorator';
import { FindStorageByIdDTO } from './dtos/find-storage-by-id.dto';
import { InsertEquipmentInStorageDTO } from './dtos/insert-equipment-in-storage.dto';
import { UpdateStoragedQuantityDTO } from './dtos/update-storaged-quantity.dto';
import { Storage } from './entities/storage.entity';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  listAllStoragedEquipments(
    @GetAuthenticatedUser() _: string,
  ): Promise<Storage[]> {
    return this.storageService.listAllStoragedEquipments();
  }

  @Post()
  insertEquipmentInStorage(
    @Body(ValidationPipe)
    insertEquipmentInStorageDTO: InsertEquipmentInStorageDTO,
    @GetAuthenticatedUser() _: string,
  ): Promise<Storage> {
    return this.storageService.insertEquipmentInStorage(
      insertEquipmentInStorageDTO,
    );
  }

  @Put(':id')
  changeStoragedEquipmentQuantity(
    @GetAuthenticatedUser() _: string,
    @Param(ValidationPipe) findStorageByIdDTO: FindStorageByIdDTO,
    @Body(ValidationPipe) updateStoragedQuantityDTO: UpdateStoragedQuantityDTO,
  ): Promise<Storage> {
    return this.storageService.updateStoragedEquipment(
      findStorageByIdDTO.id,
      updateStoragedQuantityDTO.quantity,
    );
  }
}
