import { HttpStatusCode } from 'axios';
import { KnownHttpException } from './known-http-exception';

export function createBadRequestException(msg: string, errors?: string[]) {
    return new KnownHttpException(HttpStatusCode.BadRequest, msg, errors);
}
