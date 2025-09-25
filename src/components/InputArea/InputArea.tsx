import { useState, useRef, useEffect } from "react";

interface InputAreaProps {
    onSendMessage?: (message: string) => void;
    disabled?: boolean;
}

export const InputArea = ({
    onSendMessage,
    disabled = false,
}: InputAreaProps) => {
    const [message, setMessage] = useState("");
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
            setMessage("");
        }
    };

    // Mantener foco después de cambios en el mensaje
    useEffect(() => {
        if (textareaRef.current && !disabled) {
            textareaRef.current.focus();
        }
    }, [message, disabled]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && !disabled) {
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
                className="bg-gray-300 text-gray-600 hover:bg-principal hover:text-white active:bg-principal active:text-white rounded-full transition-colors w-[36px] h-[36px] flex items-center justify-center ml-2 self-end cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                data-testid="send-button"
                onClick={handleSend}
                disabled={!message.trim() || disabled}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 620 620"
                    fill="currentColor"
                    className="w-5 h-5 text-principal group-hover:text-white"
                >
                    <path d="M322.5 351.7L523.4 150.9L391 520.3L322.5 351.7zM489.4 117L288.6 317.8L120 249.3L489.4 117zM70.1 280.8L275.9 364.4L359.5 570.2C364.8 583.3 377.6 591.9 391.8 591.9C406.5 591.9 419.6 582.7 424.6 568.8L602.6 72C606.1 62.2 603.6 51.4 596.3 44C589 36.6 578.1 34.2 568.3 37.7L71.4 215.7C57.5 220.7 48.3 233.8 48.3 248.5C48.3 262.7 56.9 275.5 70 280.8z" />
                </svg>
            </button>
        </div>
    );
};
