import { Router } from 'express';
import { methodNotAllowed } from '../common/middlewares/unhandled-method';
import { validateAuthentication } from '../iam/middlewares/validate-authentication';
import { chatController } from './chat.controller';
import { validateCreateChatDto } from './middlewares/create-chat-dto-validator';

export const chatRouter = Router();
// auth middleware
chatRouter.use(validateAuthentication);

chatRouter.post('/', validateCreateChatDto, chatController.createChat);
chatRouter.post('/:chatId', chatController.queryLLM);

chatRouter.use('/', methodNotAllowed);
