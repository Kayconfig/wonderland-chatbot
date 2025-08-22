export const EnvError = {
    notFound(variableName: string) {
        throw new Error(`environment variable: ${variableName} not found`);
    },
};
