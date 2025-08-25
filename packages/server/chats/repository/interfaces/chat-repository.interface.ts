import type { BaseMessage } from '@langchain/core/messages';
import type { Chat, Chats } from '../types';

export interface ChatRepository {
    find: (userId: string) => Promise<Chats | null>;
    createChat: (userId: string) => Promise<Chat>;
    findChatById: (userId: string, chatId: string) => Promise<Chat | null>;
    appendChatMessages: (
        userId: string,
        chatId: string,
        msgs: BaseMessage[]
    ) => Promise<void>;
    size(userId: string, chatId: string): Promise<number | undefined>;
}
