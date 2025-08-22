import { IncomingMessage } from 'http';
import type { AuthUser } from '../interfaces/auth-user';

export class IncomingMessageWithAuthUser extends IncomingMessage {
    authUser?: AuthUser;
}
