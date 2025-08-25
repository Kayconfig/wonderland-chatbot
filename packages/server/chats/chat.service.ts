import type { BaseMessage, SystemMessage } from '@langchain/core/messages';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { wonderWorldSystemChatPromptTemplate } from './prompts/wonderworld';
import { inMemChatRepo } from './repository/in-mem-chat.repository';
import type { Chat } from './repository/types';

async function getSystemMessage(): Promise<SystemMessage> {
    const parkInfoFilePath = resolve(join(__dirname, 'prompts/wonderworld.md'));
    if (!existsSync(parkInfoFilePath)) {
        throw new Error(`parkInfoFilePath: ${parkInfoFilePath} does not exist`);
    }
    const parkInfo = readFileSync(parkInfoFilePath, {
        encoding: 'utf-8',
    });
    const systemMsgContent = await wonderWorldSystemChatPromptTemplate.invoke({
        parkInfo,
    });
    return systemMsgContent[0]!;
}

export const chatService = {
    async createChat(userId: string): Promise<Chat> {
        const chat = await inMemChatRepo.createChat(userId);
        const systemMsg = await getSystemMessage();
        await this.appendChatMessages(userId, chat.id, systemMsg);
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
