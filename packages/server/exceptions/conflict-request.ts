import { HttpStatusCode } from 'axios';
import { KnownHttpException } from './known-http-exception';

export function createConflictException(msg: string, errors?: string[]) {
    return new KnownHttpException(HttpStatusCode.Conflict, msg, errors);
}
