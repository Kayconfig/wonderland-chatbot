export class UsernameConflictError extends Error {
    constructor(username: string) {
        super(`username : ${username} already exist`);
    }

    static create(username: string) {
        return new UsernameConflictError(username);
    }
}
