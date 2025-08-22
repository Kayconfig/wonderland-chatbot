import z from 'zod';

const queryLLMSchema = z.object({
    prompt: z
        .string()
        .min(2, `'prompt' is required`)
        .max(1000, `prompt is too long`),
});
