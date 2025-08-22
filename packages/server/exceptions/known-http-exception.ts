export class KnownHttpException {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly errors: string[] = []
    ) {}

    static create(statusCode: number, message: string, errors?: string[]) {
        return new KnownHttpException(statusCode, message, errors);
    }
}
