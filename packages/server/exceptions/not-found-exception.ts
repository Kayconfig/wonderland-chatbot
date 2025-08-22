import { HttpStatusCode } from 'axios';
import { KnownHttpException } from './known-http-exception';

export function createNotFoundException(msg: string, errors?: string[]) {
    return new KnownHttpException(HttpStatusCode.NotFound, msg, errors);
}
