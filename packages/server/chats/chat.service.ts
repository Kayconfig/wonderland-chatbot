import type { BaseMessage } from '@langchain/core/messages';
import { inMemChatRepo } from './repository/in-mem-chat.repository';
import type { Chat } from './repository/types';

export const chatService = {
    async createChat(userId: string): Promise<Chat> {
        const chat = await inMemChatRepo.createChat(userId);
        return chat;
    },
    async getMessages(userId: string, chatId: string): Promise<BaseMessage[]> {
        const chat = await inMemChatRepo.findChatById(userId, chatId);
        return chat?.messages ?? [];
    },
    async getChats(userId: string) {
        return await inMemChatRepo.find(userId);
    },
    async appendChatMessages(
        userId: string,
        chatId: string,
        ...msgs: BaseMessage[]
    ): Promise<void> {
        await inMemChatRepo.appendChatMessages(userId, chatId, msgs);
    },
};
