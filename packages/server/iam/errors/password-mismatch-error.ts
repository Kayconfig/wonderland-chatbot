export class PasswordMisMatchError extends Error {
    constructor() {
        super('password do not match');
    }

    static create(): PasswordMisMatchError {
        return new PasswordMisMatchError();
    }
}
