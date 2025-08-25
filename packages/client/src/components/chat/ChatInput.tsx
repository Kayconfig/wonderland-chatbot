import type { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';

export type ChatFormData = {
    prompt: string;
};

type Props = {
    onSubmit: (data: ChatFormData) => void;
    botIsTyping: boolean;
};
export default function ChatInput({ onSubmit, botIsTyping }: Props) {
    const { register, handleSubmit, reset, formState } =
        useForm<ChatFormData>();
    const submit = handleSubmit(async (data: ChatFormData) => {
        reset({ prompt: '' });
        onSubmit(data);
    });

    const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };
    return (
        <form
            autoFocus
            onSubmit={submit}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
        >
            <textarea
                {...register('prompt', {
                    required: true,
                    validate: (data) => data.trim().length > 0,
                })}
                className="w-full border-0 focus:outline-0 resize-none"
                placeholder="send a message"
                maxLength={1000}
            />
            <Button
                disabled={!formState.isValid || botIsTyping}
                className=" w-9 h-9 rounded-full"
            >
                <FaArrowUp />
            </Button>
        </form>
    );
}
