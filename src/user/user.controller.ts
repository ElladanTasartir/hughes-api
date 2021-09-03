import { Controller, Get, Delete, HttpCode, HttpStatus, Param, ValidationPipe } from '@nestjs/common';
import { GetAuthenticatedUser } from './decorators/auth.decorator';
import { FindUserByIdDTO } from './dtos/find-user-by-id.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
	) { }

	@Get()
	getUsers(
		@GetAuthenticatedUser() _: string,
	): Promise<User[]> {
		return this.userService.getUsers();
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteUser(
		@GetAuthenticatedUser() _: string,
		@Param(ValidationPipe) findUserByIdDTO: FindUserByIdDTO,
	): Promise<void> {
		return this.userService.deleteUser(findUserByIdDTO.id);
	}
}