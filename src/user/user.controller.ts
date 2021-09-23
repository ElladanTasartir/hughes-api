import {
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Body,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { GetAuthenticatedUser } from './decorators/auth.decorator';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers(@GetAuthenticatedUser() _: string): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Put()
  updateUser(
    @GetAuthenticatedUser() user_id: string,
    @Body(ValidationPipe) updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return this.userService.updateUser(user_id, updateUserDTO);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@GetAuthenticatedUser() user_id: string): Promise<void> {
    return this.userService.deleteUser(user_id);
  }
}
