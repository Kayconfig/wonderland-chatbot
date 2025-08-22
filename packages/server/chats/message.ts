import {
    AIMessage,
    HumanMessage,
    SystemMessage,
} from '@langchain/core/messages';

export function createHumanMsg(content: string): HumanMessage {
    return new HumanMessage({ content });
}
export function createAiMsg(content: string): AIMessage {
    return new AIMessage({ content });
}

export function createSystemMsg(content: string): SystemMessage {
    return new SystemMessage({ content });
}
