import { HttpStatusCode } from 'axios';
import { KnownHttpException } from './known-http-exception';

export function createUnAuthorizedException(msg: string, errors?: string[]) {
    return new KnownHttpException(HttpStatusCode.Unauthorized, msg, errors);
}
