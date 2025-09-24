import { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
    onSendMessage?: (message: string) => void;
    disabled?: boolean;
}

export const InputArea = ({ onSendMessage, disabled = false }: InputAreaProps) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Asegurar que el textarea tenga foco inicial
    useEffect(() => {
        if (textareaRef.current && !disabled) {
            textareaRef.current.focus();
        }
    }, [disabled]);

    const handleSend = () => {
        if (message.trim() && onSendMessage && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    // Mantener foco después de cambios en el mensaje
    useEffect(() => {
        if (textareaRef.current && !disabled) {
            textareaRef.current.focus();
        }
    }, [message, disabled]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            handleSend();
            // Asegurar que el foco se mantenga después del keypress
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 10);
        }
    };

    return (
        <div
            className="h-[150px] w-full p-4 sticky bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex"
            data-testid="input-area"
        >
            <textarea
                ref={textareaRef}
                className=" text-start border-principal w-full h-full p-2 border rounded-lg text-sm resize-none"
                placeholder="Escribe un mensaje..."
                id="message-input"
                name="message-input"
                rows={4}
                cols={50}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                data-testid="message-textarea"
                disabled={disabled}
            />

            <button
                className="bg-gray-300 text-gray-600 hover:bg-principal hover:text-white active:bg-principal active:text-white rounded-full transition-colors w-[40px] h-[40px] flex items-center justify-center ml-2 self-end cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="send-button"
                onClick={handleSend}
                disabled={!message.trim() || disabled}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-[20px] h-[20px]"
                    viewBox="0 0 20 20"
                >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
            </button>
        </div>
    );
};
