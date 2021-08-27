import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePlanDTO } from './dtos/create-plan.dto';
import { Plan } from './entities/plan.entity';
import { PlanRepository } from './plan.repository';

@Injectable()
export class PlanService {
  constructor(
    @Inject('PLAN_REPOSITORY')
    private readonly planRepository: PlanRepository,
  ) {}

  findPlans(): Promise<Plan[]> {
    return this.planRepository.findPlans();
  }

  async createPlan(createPlanDTO: CreatePlanDTO): Promise<Plan> {
    const { name } = createPlanDTO;

    const planAlreadyExists = await this.planRepository.findPlanByName(name);

    if (planAlreadyExists) {
      throw new BadRequestException(`Plan with name "${name}" already exists`);
    }

    return this.planRepository.createPlan(createPlanDTO);
  }
}
