import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpUserDTO } from './dtos/sign-up-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  findUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  createUser(signUpUserDTO: SignUpUserDTO): Promise<User> {
    const user = this.userRepository.create(signUpUserDTO);

    return this.userRepository.save(user);
  }

  updateUser(user: User, updateUserDTO: UpdateUserDTO): Promise<User> {
    const { name, email, new_password } = updateUserDTO;

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = new_password || new_password;

    return this.userRepository.save(user);
  }

  findUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async deleteUser(user: User): Promise<void> {
    await this.userRepository.remove(user);
  }
}
