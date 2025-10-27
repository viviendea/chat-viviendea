export const Author = {
    USER: "user",
    ELE: "ele",
    ESE: "ese",
    ALE: "ale",
} as const;

export type Author = (typeof Author)[keyof typeof Author];
export interface MessageType {
    content: string;
    role: Author;
    timestamp: Date;
    img?: string | null | undefined;
    isLastMessage?: boolean;
    showResendTooltip?: boolean;
    onResend?: () => void;
    loginUrl?: string;
    isFinished?: boolean;
}

export interface ChatState {
    messages: MessageType[];
    isLoading: boolean;
}
