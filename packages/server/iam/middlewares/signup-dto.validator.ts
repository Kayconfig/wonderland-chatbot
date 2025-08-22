import type { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { createBadRequestException } from '../../exceptions/bad-request';
const signUpSchema = z.object({
    username: z
        .string(`'username' must be string`)
        .min(3, { error: `'username' must be at least 3 characters long` })
        .max(25, { error: `'username' must not exceed 25 characters` }),
    password: z
        .string(`'password' must be a string`)
        .min(8, { error: `'password' must be minimum of 8 characters` })
        .max(100, { error: `'password' must not exceed 100 characters` }),
});

export async function validateSignUpDto(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const parseResult = await signUpSchema.safeParseAsync(req.body);
        if (!parseResult.success) {
            next(
                createBadRequestException(
                    'unable to signup, invalid payload',
                    parseResult.error.issues.map((issue) => issue.message)
                )
            );
            return;
        }

        req.body = parseResult.data;
        next();
    } catch (e) {
        next(e);
    }
}
