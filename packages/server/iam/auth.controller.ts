import { HttpStatusCode } from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { createConflictException } from '../exceptions/conflict-request';
import { createUnAuthorizedException } from '../exceptions/unauthorized-request';
import type { UserDto } from '../user/dtos/user.dto';
import { UserNotFoundError } from '../user/errors/user-not-found-error';
import { UsernameConflictError } from '../user/errors/username-conflict-error';
import { authService } from './auth.service';
import { PasswordMisMatchError } from './errors/password-mismatch-error';

export const authController = {
    async signin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const signinDto = req.body;
            const { user, accessToken } = await authService.signin(signinDto);
            const userDto: UserDto = { id: user.id, username: user.username };
            res.status(HttpStatusCode.Ok).json({
                statusCode: HttpStatusCode.Ok,
                message: 'login successfully',
                data: { user: userDto, accessToken },
                errors: [],
            });
            return;
        } catch (e) {
            if (
                e instanceof UserNotFoundError ||
                e instanceof PasswordMisMatchError
            ) {
                next(createUnAuthorizedException('login failed: unauthorized'));
                return;
            }
            next(e);
        }
    },
    async signup(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const signUpDto = req.body;
            const { accessToken, user } = await authService.signUp(signUpDto);
            const userDto: UserDto = { id: user.id, username: user.username };
            const statusCode: number = HttpStatusCode.Created;
            res.status(statusCode).json({
                statusCode,
                message: 'sign up successful',
                data: { accessToken, user: userDto },
                errors: [],
            });
            return;
        } catch (e) {
            if (e instanceof UsernameConflictError) {
                next(createConflictException('username already exist'));
                return;
            }
            next(e);
        }
    },
};
