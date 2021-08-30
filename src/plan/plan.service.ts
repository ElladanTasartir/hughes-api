import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDTO } from './dtos/create-plan.dto';
import { UpdatePlanDTO } from './dtos/update-plan.dto';
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

  async updatePlan(id: string, updatePlanDTO: UpdatePlanDTO): Promise<Plan> {
    const foundPlan = await this.planRepository.findPlanById(id);

    if (!foundPlan) {
      throw new NotFoundException(`No plan found with ID "${id}"`);
    }

    return this.planRepository.updatePlan(foundPlan, updatePlanDTO);
  }

  async deletePlan(id: string): Promise<void> {
    const foundPlan = await this.planRepository.findPlanById(id);

    if (!foundPlan) {
      throw new NotFoundException(`No plan found with ID "${id}"`);
    }

    await this.planRepository.deletePlan(foundPlan);
  }
}
