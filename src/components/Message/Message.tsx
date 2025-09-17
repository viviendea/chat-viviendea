import { useMemo } from "react";
import { Author, type MessageType } from "../../types/chat";
import { useTypewriter } from "../../hooks/useTypewriter";

const DEFAULT_CONTENT =
    "¡Hola! Soy Ele y voy a guiarte en el diseño de tu vivienda ideal. Pero primero empezemos por lo más importante, ¿Dónde te gustaría vivir?";

const Message = ({
    content = DEFAULT_CONTENT,
    role = Author.ELE,
    timestamp = new Date(),
    img = null,
    isLastMessage = false,
}: MessageType) => {
    const isUserMessage = role === Author.USER;
    
    // Usar efecto typewriter solo para mensajes que no sean del usuario Y que sean el último mensaje
    const shouldUseTypewriter = !isUserMessage && isLastMessage;
    const { displayText } = useTypewriter({
        text: shouldUseTypewriter ? content : "",
        speed: 50, // Más lento para ser más suave
        startDelay: img ? 800 : 100, // Delay más largo si hay imagen para que se cargue primero
    });
    
    // Mostrar el texto con efecto typewriter o el texto completo según el tipo de mensaje
    const messageContent = shouldUseTypewriter ? displayText : content;

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
                            src={`/${role}-avatar.png`}
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
                    </footer>
                </div>
            </div>
        </section>
    );
};

export default Message;
