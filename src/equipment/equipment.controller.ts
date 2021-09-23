import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { GetAuthenticatedUser } from 'src/user/decorators/auth.decorator';
import { CreateEquipmentDTO } from './dtos/create-equipment.dto';
import { FindEquipmentDTO } from './dtos/find-equipment.dto';
import { UpdateEquipmentDTO } from './dtos/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { EquipmentService } from './equipment.service';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  getAllEquipments(@GetAuthenticatedUser() _: string): Promise<Equipment[]> {
    return this.equipmentService.getAllEquipments();
  }

  @Post()
  createNewEquipment(
    @GetAuthenticatedUser() _: string,
    @Body(ValidationPipe) createEquipmentDTO: CreateEquipmentDTO,
  ): Promise<Equipment> {
    return this.equipmentService.createNewEquipment(createEquipmentDTO);
  }

  @Put(':id')
  updateEquipment(
    @GetAuthenticatedUser() _: string,
    @Param(ValidationPipe) findEquipmentDTO: FindEquipmentDTO,
    @Body(ValidationPipe) updateEquipmentDTO: UpdateEquipmentDTO,
  ): Promise<Equipment> {
    return this.equipmentService.updateEquipment(
      findEquipmentDTO.id,
      updateEquipmentDTO,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteEquipment(
    @GetAuthenticatedUser() _: string,
    @Param(ValidationPipe) findEquipmentDTO: FindEquipmentDTO,
  ): Promise<void> {
    return this.equipmentService.deleteEquipment(findEquipmentDTO.id);
  }
}
