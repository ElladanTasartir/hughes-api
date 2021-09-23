import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { UpdateUserDTO } from './dtos/update-user.dto';
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

  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const { email, password, new_password } = updateUserDTO;

    const userExists = await this.userRepository.findUserById(id);

    if (!userExists) {
      throw new NotFoundException(`User with ID "${id}" does not exist`);
    }

    if (email) {
      const foundUserByEmail = await this.userRepository.findUserByEmail(email);

      if (foundUserByEmail && foundUserByEmail.id === id) {
        throw new BadRequestException(
          `User with email "${email}" already exists`,
        );
      }
    }

    if (new_password) {
      if (!password) {
        throw new BadRequestException(
          `You must provide user's current password to update user password`,
        );
      }

      const passwordMatched = await compare(password, userExists.password);

      if (!passwordMatched) {
        throw new BadRequestException(`Password does not match`);
      }

      const newPasswordHashed = await hash(new_password, 10);

      return this.userRepository.updateUser(userExists, {
        ...updateUserDTO,
        new_password: newPasswordHashed,
      });
    }

    return this.userRepository.updateUser(userExists, updateUserDTO);
  }

  async deleteUser(id: string): Promise<void> {
    const foundUser = await this.userRepository.findUserById(id);

    if (!foundUser) {
      throw new NotFoundException(`User with ID "${id}" was not found`);
    }

    return this.userRepository.deleteUser(foundUser);
  }
}
