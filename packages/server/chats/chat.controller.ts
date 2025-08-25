import { HttpStatusCode } from 'axios';
import { type NextFunction, type Response } from 'express';
import { createNotFoundException } from '../exceptions/not-found-exception';
import type { RequestWithAuthUser } from '../iam/interfaces/auth-user';
import { getOllamaChatModel } from '../ollama/chat-model';
import { chatService } from './chat.service';
import type { ChatDto } from './dtos/chat.dto';
import { createHumanMsg } from './message';
import { ChatNotFoundError } from './repository/errors/chat-not-found';
import { ChatsNotFoundError } from './repository/errors/chats-not-found';

export const chatController = {
    async createChat(
        req: RequestWithAuthUser,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.authUser?.id;
            const chat = await chatService.createChat(userId!);
            const chatDto: ChatDto = { id: chat.id };
            res.status(HttpStatusCode.Created).json({
                statusCode: HttpStatusCode.Created,
                message: 'chat created successfully',
                data: chatDto,
            });
        } catch (e) {
            next(e);
        }
    },
    async queryLLM(
        req: RequestWithAuthUser,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const prompt = req.body.prompt;
            const userId = req.authUser?.id as string;
            const chatId = req.params.chatId as string;

            const llm = getOllamaChatModel();

            const userMsg = createHumanMsg(prompt);
            const msgHistory = await chatService.getMessages(userId, chatId);

            const aiMsg = await llm.invoke(msgHistory.concat(userMsg));
            // update history
            await chatService.appendChatMessages(
                userId,
                chatId,
                userMsg,
                aiMsg
            );
            res.json({
                statusCode: HttpStatusCode.Ok,
                message: 'prompt sent successfully',
                data: { message: aiMsg.content },
                errors: [],
            });
            return;
        } catch (e) {
            if (
                e instanceof ChatsNotFoundError ||
                e instanceof ChatNotFoundError
            ) {
                next(createNotFoundException('chat not found'));
            }
            next(e);
        }
    },
};
