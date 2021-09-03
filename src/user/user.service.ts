import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.findUsers();
  }

  async deleteUser(id: string, user_id: string): Promise<void> {
    if (id === user_id) {
      throw new BadRequestException(`User cannot delete its own account`);
    }

    const foundUser = await this.userRepository.findUserById(id);

    if (!foundUser) {
      throw new NotFoundException(`User with ID "${id}" was not found`);
    }

    return this.userRepository.deleteUser(foundUser);
  }
}
