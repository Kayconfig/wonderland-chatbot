import { HttpStatusCode } from 'axios';
import cookieparser from 'cookie-parser';
import 'dotenv';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import { chatRouter } from './chats/chat.router';
import { KnownHttpException } from './exceptions/known-http-exception';
import { authRouter } from './iam/auth.router';

export const app = express();

/* set middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

/* register routers */
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/auth', authRouter);

/* handle unhandled routes */
app.use('/', (req, res) => {
    res.status(404).json({ message: 'path not found' });
});

// handle errors
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof KnownHttpException) {
        const statusCode = err.statusCode;
        const message = err.message;
        const errors = err.errors;
        return res
            .status(statusCode)
            .json({ statusCode, message, data: null, errors });
    }

    if (err instanceof SyntaxError) {
        const statusCode = HttpStatusCode.BadRequest;
        const message = err.message;
        return res
            .status(statusCode)
            .json({ statusCode, message, data: null, errors: [] });
    }

    console.error(err);
    return res.status(500).json({
        statusCode: HttpStatusCode.InternalServerError,
        message: 'Unable to process request, please try again later',
        data: null,
        errors: [],
    });
});
