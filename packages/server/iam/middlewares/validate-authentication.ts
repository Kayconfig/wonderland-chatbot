import type { NextFunction } from 'express';
import type { ServerResponse } from 'http';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { ENV_KEYS } from '../../config/env-keys';
import { getSecretOrThrow } from '../../config/get-secret';
import { createUnAuthorizedException } from '../../exceptions/unauthorized-request';
import { UserNotFoundError } from '../../user/errors/user-not-found-error';
import { userService } from '../../user/user.service';
import type { IncomingMessageWithAuthUser } from '../classes/incoming-message-with-auth-user';
import { SESSION_COOKIE_NAME } from '../constants';

function getTokenFromHeader(
    req: IncomingMessageWithAuthUser
): string | undefined {
    const authorization = req?.headers?.authorization;
    if (!authorization) return undefined;
    const [, token] = authorization.split(' ') as string[];
    return token;
}

function getTokenFromCookie(req: any): string | undefined {
    const tokenKey = SESSION_COOKIE_NAME;
    const token = req?.cookies?.[tokenKey]?.authToken;
    return token;
}

export async function validateAuthentication(
    req: IncomingMessageWithAuthUser,
    res: ServerResponse,
    next: NextFunction
): Promise<void> {
    try {
        let token: string | undefined =
            getTokenFromHeader(req) ?? getTokenFromCookie(req);

        if (!token) {
            next(createUnAuthorizedException('unauthorized'));
            return;
        }
        const secret = getSecretOrThrow(ENV_KEYS.JWT_SECRET);
        const issuer = getSecretOrThrow(ENV_KEYS.JWT_ISSUER);
        const payload = await jwt.verify(token, secret, { issuer });
        const userId = payload.sub as string;
        // ensure that user exists, needs refactoring - we can't be calling the db everytime to see if a user exists in the db
        await userService.getById(userId);

        req.authUser = { id: userId };
        next();
    } catch (e) {
        if (e instanceof JsonWebTokenError || e instanceof UserNotFoundError) {
            next(createUnAuthorizedException('unauthorized'));
            return;
        }
        next(e);
    }
}
