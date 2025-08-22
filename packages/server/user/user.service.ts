import type { CreateUserDto } from './dtos/create-user.dto';
import { UserNotFoundError } from './errors/user-not-found-error';
import { UsernameConflictError } from './errors/username-conflict-error';
import type { User } from './user.entity';
import { userRepository } from './user.repository';

export const userService = {
    async createUser(dto: CreateUserDto): Promise<User> {
        const usernameAlreadyExists =
            (await userRepository.getByUsername(dto.username)) !== null;
        if (usernameAlreadyExists) {
            throw UsernameConflictError.create(dto.username);
        }
        const user = await userRepository.createUser(dto);
        return user;
    },
    async getByUsername(username: string): Promise<User> {
        const user = await userRepository.getByUsername(username);
        if (!user) throw UserNotFoundError.create();
        return user;
    },
    async getById(id: string): Promise<User> {
        const user = await userRepository.getById(id);
        if (!user) throw UserNotFoundError.create();
        return user;
    },
};
