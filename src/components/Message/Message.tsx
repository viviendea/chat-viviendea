import { useMemo } from "react";
import { Author, type MessageType } from "../../types/chat";
import { getAvatarPath } from "../../utils/assets";
import { useTypingLoop } from "../../hooks/useTypingLoop";

const DEFAULT_CONTENT =
    "¡Hola! Soy Ele y voy a guiarte en el diseño de tu vivienda ideal. Pero primero empezemos por lo más importante, ¿Dónde te gustaría vivir?";

const Message = ({
    content = DEFAULT_CONTENT,
    role = Author.ELE,
    timestamp = new Date(),
    img = null,
    showResendTooltip = false,
    onResend,
}: MessageType) => {
    const isUserMessage = role === Author.USER;
    const isTypingMessage = content === "Escribiendo...";
    
    // Usar efecto typewriter en bucle solo para el mensaje "Escribiendo..."
    const { displayText } = useTypingLoop({
        enabled: isTypingMessage && !isUserMessage,
        text: content,
    });
    
    // Mostrar texto con efecto para "Escribiendo..." o texto completo para otros mensajes
    const messageContent = isTypingMessage && !isUserMessage ? displayText : content;

    const formattedTime = useMemo(
        () =>
            timestamp.toLocaleTimeString("es-ES", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            }),
        [timestamp]
    );

    const messageClasses = useMemo(
        () => ({
            container: ` text-xs md:text-sm message-content flex gap-4 items-start mb-2 ${
                isUserMessage ? "justify-end" : "items-start"
            }`,
            avatar: `max-w-[40px] md:max-w-[50px] ${isUserMessage ? "hidden" : "visible"}`,
            bubble: `p-4 rounded-lg shadow-md flex-1 ${
                isUserMessage ? "bg-principal" : "bg-secundary"
            }`,
            footer: `flex ${isUserMessage ? "justify-end" : "items-start"}`,
        }),
        [isUserMessage]
    );

    return (
        <section
            className="message w-full"
            role="article"
            aria-label={`Mensaje de ${role}`}
            data-testid="chat-message"
        >
            <div className={messageClasses.container}>
                {!isUserMessage && (
                    <div className={messageClasses.avatar}>
                        <img
                            src={getAvatarPath(role)}
                            alt={`Avatar de ${role}`}
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="max-w-9/12 md:max-w-10/12">
                    <article className={messageClasses.bubble}>
                        {img && (
                            <div className="mb-4 overflow-hidden rounded-lg w-full">
                                <img
                                    data-testid="message-image "
                                    src={img}
                                    alt={`Imagen de mensaje de ${role}`}
                                    loading="eager"
                                    className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                                    style={{ minHeight: '200px' }}
                                />
                            </div>
                        )}
                        <p className="text-white">
                            {messageContent}
                        </p>
                    </article>

                    <footer className={messageClasses.footer}>
                        <time
                            className="text-gray-400 mt-1 text-sm"
                            dateTime={timestamp.toISOString()}
                        >
                            {`${isUserMessage ? "Enviado" : "Recibido"}: ${formattedTime} h.`}
                        </time>
                        
                        {/* Tooltip de reenvío para mensajes de usuario con error */}
                        {showResendTooltip && isUserMessage && onResend && (
                            <div className="relative inline-block ml-2">
                                <button
                                    onClick={onResend}
                                    className="resend-tooltip bg-gray-400 hover:bg-gray-500 text-white text-xs px-2 py-1 rounded-4xl flex items-center gap-1 transition-colors duration-200 cursor-pointer mt-0.5"
                                    aria-label="Reenviar mensaje"
                                    title="Reenviar mensaje"
                                >
                                    <svg 
                                        width="12" 
                                        height="12" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z" 
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Reenviar
                                </button>
                            </div>
                        )}
                    </footer>
                </div>
            </div>
        </section>
    );
};

export default Message;
