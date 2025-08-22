export class UserNotFoundError extends Error {
    constructor() {
        super('user not found');
    }

    static create(): UserNotFoundError {
        return new UserNotFoundError();
    }
}
