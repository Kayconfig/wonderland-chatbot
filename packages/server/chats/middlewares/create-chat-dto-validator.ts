import type { NextFunction, Request, Response } from 'express';
import z from 'zod';

const createChatSchema = z.object({
    user: z.object(
        { id: z.uuidv7(`'id' must be provided`) },
        { error: `'user' must be provided` }
    ),
});

export async function validateCreateChatDto(
    req: Request,
    _: Response,
    next: NextFunction
) {
    try {
        // const parseResult = await createChatSchema.safeParseAsync(req.body);
        // if (!parseResult.success) {
        //     next(
        //         createBadRequestException(
        //             'unable to create chat: invalid payload',
        //             parseResult.error.issues.map((issue) => issue.message)
        //         )
        //     );
        //     return;
        // }
        // req.body = parseResult.data;
        next();
    } catch (e) {
        next(e);
    }
}
