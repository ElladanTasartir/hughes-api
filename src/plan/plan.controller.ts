import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreatePlanDTO } from './dtos/create-plan.dto';
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
    @Body(new ValidationPipe({ transform: true })) createPlanDTO: CreatePlanDTO,
  ): Promise<Plan> {
    return this.planService.createPlan(createPlanDTO);
  }
}
