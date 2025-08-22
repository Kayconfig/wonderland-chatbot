import type { Request } from 'express';

export interface AuthUser {
    id: string;
}

export type RequestWithAuthUser = Request & { authUser?: AuthUser };
