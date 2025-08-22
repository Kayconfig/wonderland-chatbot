import { randomUUIDv7 } from 'bun';
import { ChatNotFoundError } from './errors/chat-not-found';
import { ChatsNotFoundError } from './errors/chats-not-found';
import type { ChatRepository } from './interfaces/chat-repository.interface';
import type { Chat, ChatId, Chats, UserId } from './types';

const chatDb: Map<UserId, Chats> = new Map<UserId, Chats>();

function createChats(): Chats {
    return new Map<ChatId, Chat>();
}

function createChat(name: string): Chat {
    return { id: randomUUIDv7(), name, messages: [] };
}

export const inMemChatRepo: ChatRepository = {
    async createChat(userId) {
        let chats = chatDb.get(userId);
        if (!chats) {
            const newChats = createChats();
            chatDb.set(userId, newChats);
            chats = newChats;
        }
        const chat = createChat('');
        chats.set(chat.id, chat);
        return chat;
    },
    async find(userId): Promise<Chats | null> {
        return chatDb.get(userId) ?? null;
    },
    async findChatById(userId, chatId) {
        const chats = await this.find(userId);
        if (!chats) throw ChatsNotFoundError.create(userId);
        return chats.get(chatId) ?? null;
    },

    async appendChatMessages(userId, chatId, messages): Promise<void> {
        const chats = await this.find(userId);
        if (!chats) throw ChatsNotFoundError.create(userId);

        const chat = chats.get(chatId);
        if (!chat) throw ChatNotFoundError.create(chatId);

        const existingChatMsgs = chat.messages;

        chat.messages = existingChatMsgs.concat(messages);
        chats?.set(chatId, chat);
    },
};
