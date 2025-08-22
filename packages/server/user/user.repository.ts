import { randomUUIDv7 } from 'bun';
import type { CreateUserDto } from './dtos/create-user.dto';
import type { User } from './user.entity';

const userDb = new Map<string, User>();
type Username = string;
type UserId = string;
const userNameToId = new Map<Username, UserId>();

async function saveUser(user: User) {
    userDb.set(user.id, user);
    userNameToId.set(user.username, user.id);
}
export const userRepository = {
    async createUser(dto: CreateUserDto): Promise<User> {
        const id = randomUUIDv7();
        const newUser = { id, username: dto.username, password: dto.password };
        await saveUser(newUser);
        return newUser;
    },
    async getById(id: string): Promise<User | null> {
        return userDb.get(id) ?? null;
    },
    async getByUsername(username: string): Promise<User | null> {
        const userId = userNameToId.get(username);
        if (!userId) return null;

        return userDb.get(userId) ?? null;
    },
};
