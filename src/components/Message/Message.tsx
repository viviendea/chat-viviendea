import { useMemo } from "react";
import { Author, type MessageType } from "../../types/chat";

const DEFAULT_CONTENT =
    "¡Hola! Soy Ele y voy a guiarte en el diseño de tu vivienda ideal. Pero primero empezemos por lo más importante, ¿Dónde te gustaría vivir?";

const Message = ({
    content = DEFAULT_CONTENT,
    role = Author.ELE,
    timestamp = new Date(),
    img = null,
}: MessageType) => {
    const isUserMessage = role === Author.USER;

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
                                    loading="lazy"
                                    className="object-fit"
                                />
                            </div>
                        )}
                        <p className="text-white">{content}</p>
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
