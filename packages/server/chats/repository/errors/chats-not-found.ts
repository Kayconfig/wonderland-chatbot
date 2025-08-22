export class ChatsNotFoundError extends Error {
    constructor(userId: string) {
        super(`chats for user #id: ${userId} not found`);
    }

    static create(userId: string): ChatsNotFoundError {
        return new ChatsNotFoundError(userId);
    }
}
