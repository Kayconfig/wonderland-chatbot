import { useEffect, useState } from 'react';
import axios from 'axios';
import { showErrToast, showToastWhileLoading } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useNavigate } from 'react-router';
import { PAGE_PATHS } from '@/lib/paths';
import TypingIndicator from './TypingIndicator';
import type { Messages } from './types/messages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';

type ChatResponse = {
    data: { message: string };
};

export default function ChatBot() {
    const [chatId, setChatId] = useState<string>('');
    const [botIsTyping, setIsBotTyping] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [msgs, setMsgs] = useState<Messages>([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [shouldCreateChat, setShouldCreateChat] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const authCtx = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        authCtx
            .isAuthenticated()
            .then((userIsAuthenticated) => {
                setAuthenticated(userIsAuthenticated);

                setShouldCreateChat(userIsAuthenticated);
            })
            .catch(() => setErrorOccurred(true));
    }, []);

    useEffect(() => {
        if (!loading && !authenticated) {
            navigate(PAGE_PATHS.LOGIN_PAGE);
        }
    }, [authenticated]);

    useEffect(() => {
        if (shouldCreateChat) {
            if (!authenticated) {
                navigate(PAGE_PATHS.LOGIN_PAGE);
                return;
            }

            showToastWhileLoading(axios.post('/api/v1/chat'), {
                pendingText: 'preparing chat...',
                successText: 'chat ready now',
                errorText: 'unable to load chat',
            })
                .then((res) => setChatId(res.data.data.id))
                .catch((e) => setErrorOccurred(true))
                .finally(() => setLoading(false));
        }
    }, [shouldCreateChat]);

    const onSubmit = async (data: ChatFormData) => {
        setErrMsg('');
        try {
            if (botIsTyping) {
                return;
            }

            if (!chatId) {
                showErrToast('unable to send chat, please reload page');
                return;
            }
            setIsBotTyping(true);
            setMsgs((prevValue) => [
                ...prevValue,
                { content: data.prompt, role: 'user' },
            ]);
            const resp = await axios.post<ChatResponse>(
                `/api/v1/chat/${chatId}`,
                data
            );

            setMsgs((prevValue) => [
                ...prevValue,
                { content: resp.data.data.message, role: 'bot' },
            ]);
        } catch (err) {
            // log the error, use sentry in production
            console.error(err);
            setErrMsg('Something went wrong, try again!');
        } finally {
            setIsBotTyping(false);
        }
    };

    if (loading) {
        return <></>;
    }

    if (errorOccurred) {
        return <p>Error occurred, please reload page</p>;
    }

    if (!shouldCreateChat) {
        return <p>Unexpected error occurred, please try again later.</p>;
    }

    return (
        <div className="p-4 flex flex-col h-full w-full">
            <div className="flex flex-col gap-3 mb-10 flex-1 overflow-y-auto">
                <ChatMessages messages={msgs} />
                {botIsTyping && <TypingIndicator />}
                {errMsg && <p className={'text-red-500'}>{errMsg}</p>}
            </div>

            <ChatInput onSubmit={onSubmit} botIsTyping={botIsTyping} />
        </div>
    );
}
