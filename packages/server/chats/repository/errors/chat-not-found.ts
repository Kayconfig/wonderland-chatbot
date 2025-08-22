export class ChatNotFoundError extends Error {
    constructor(id: string) {
        super(`chat #id: ${id} not found`);
    }

    static create(id: string): ChatNotFoundError {
        return new ChatNotFoundError(id);
    }
}
