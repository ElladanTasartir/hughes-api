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
import { CreatePlanDTO } from './dtos/create-plan.dto';
import { FindPlanDTO } from './dtos/find-plan.dto';
import { UpdatePlanDTO } from './dtos/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  findPlans(): Promise<Plan[]> {
    return this.planService.findPlans();
  }

  @Post()
  createPlan(
    @Body(ValidationPipe) createPlanDTO: CreatePlanDTO,
  ): Promise<Plan> {
    return this.planService.createPlan(createPlanDTO);
  }

  @Put('/:id')
  updatePlan(
    @Param(ValidationPipe) findPlanDTO: FindPlanDTO,
    @Body(ValidationPipe) updatePlanDTO: UpdatePlanDTO,
  ): Promise<Plan> {
    return this.planService.updatePlan(findPlanDTO.id, updatePlanDTO);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePlan(@Param(ValidationPipe) findPlanDTO: FindPlanDTO): Promise<void> {
    return this.planService.deletePlan(findPlanDTO.id);
  }
}
