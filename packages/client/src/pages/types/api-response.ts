export type ApiResponse<T extends any> = {
    statusCode: number;
    message: string;
    data: T;
    errors: string[];
};
