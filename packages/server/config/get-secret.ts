import { EnvError } from '../errors/env-not-found';

export function getSecretOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) throw EnvError.notFound(key);
    return value;
}

export function getSecret(key: string): string | undefined {
    return process.env[key];
}
