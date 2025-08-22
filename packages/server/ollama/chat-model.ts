import { ChatOllama } from '@langchain/ollama';
import { ENV_KEYS } from '../config/env-keys';
import { getSecretOrThrow } from '../config/get-secret';

export function getOllamaChatModel(model?: string) {
    if (!model) {
        model = getSecretOrThrow(ENV_KEYS.OLLAMA_MODEL_NAME);
    }
    return new ChatOllama({ model, temperature: 0.2 });
}
