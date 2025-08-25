import { HttpStatusCode } from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { KnownHttpException } from '../../exceptions/known-http-exception';
import { SESSION_COOKIE_NAME } from '../constants';

export async function clearUnauthorizedCookie(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (
        err instanceof KnownHttpException &&
        err.statusCode === HttpStatusCode.Unauthorized
    ) {
        res.clearCookie(SESSION_COOKIE_NAME);
    }
    next(err);
}
