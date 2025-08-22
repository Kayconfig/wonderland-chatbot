import jwt from 'jsonwebtoken';
import { ENV_KEYS } from '../config/env-keys';
import { getSecretOrThrow } from '../config/get-secret';
import type { User } from '../user/user.entity';
import { userService } from '../user/user.service';
import { passwordUtil } from '../utils/password.util';
import type { SignInDto } from './dtos/signin.dto';
import type { SignUpDto } from './dtos/signup.dto';
import { PasswordMisMatchError } from './errors/password-mismatch-error';

export const authService = {
    async signUp(
        signUpDto: SignUpDto
    ): Promise<{ accessToken: string; user: User }> {
        signUpDto.password = await passwordUtil.hash(signUpDto.password);
        const user: User = await userService.createUser(signUpDto);
        const accessToken: string = await this.generateAccessToken(user);
        return { user, accessToken };
    },

    async signin(
        signInDto: SignInDto
    ): Promise<{ accessToken: string; user: User }> {
        const user: User = await userService.getByUsername(signInDto.username);
        const passwordIsValid = await passwordUtil.compare(
            signInDto.password,
            user.password
        );
        if (!passwordIsValid) {
            throw PasswordMisMatchError.create();
        }
        const accessToken: string = await this.generateAccessToken(user);
        return { user, accessToken };
    },
    generateAccessToken(user: User): string {
        const secret: string = getSecretOrThrow(ENV_KEYS.JWT_SECRET);
        const issuer: string = getSecretOrThrow(ENV_KEYS.JWT_ISSUER);
        const payload = { sub: user.id };
        return jwt.sign(payload, secret, { issuer });
    },
};
