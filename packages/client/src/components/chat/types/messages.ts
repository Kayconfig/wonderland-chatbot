export type Message = {
    content: string;
    role: 'user' | 'bot';
};

export type Messages = Message[];
