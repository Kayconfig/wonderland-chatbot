import type { BaseMessage } from '@langchain/core/messages';

export type ChatId = string;

export type UserId = string;

export type Messages = BaseMessage[];

export type Chats = Map<ChatId, Chat>;

export type Chat = { id: string; name: string; messages: Messages };
