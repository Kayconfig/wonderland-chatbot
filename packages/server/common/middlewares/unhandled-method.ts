import { HttpStatusCode } from 'axios';
import type { Request, Response } from 'express';

export function methodNotAllowed(req: Request, res: Response): void {
    const statusCode = HttpStatusCode.MethodNotAllowed;
    res.status(statusCode).json({
        statusCode,
        message: `Method '${req.method}' not allowed on this path`,
        data: null,
        errors: [],
    });
}
