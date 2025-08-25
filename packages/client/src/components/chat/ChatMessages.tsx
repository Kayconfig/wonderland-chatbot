import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Messages } from './types/messages';
import remarkGfm from 'remark-gfm';

type ChatMessagesProp = {
    messages: Messages;
};

const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', selection);
    }
};

export default function ChatMessages({ messages }: ChatMessagesProp) {
    const lastMsgRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (
        <div className="flex flex-col gap-3">
            {messages.map((message, idx) => (
                <div
                    key={idx}
                    ref={idx === messages.length - 1 ? lastMsgRef : null}
                    onCopy={onCopyMessage}
                    className={`px-3 max-w-md py-1 rounded-xl ${
                        message.role === 'user'
                            ? 'bg-blue-600 text-white self-end'
                            : 'bg-gray-100 text-black self-start'
                    }`}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                </div>
            ))}
        </div>
    );
}
