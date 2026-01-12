import { useState, useRef, useEffect } from "react";
import { Author, type MessageType } from "../../types/chat";
import { InputArea } from "../InputArea/InputArea";
import Message from "../Message/Message";
import { chatApiService } from "../../services/chatApi";
import { getChatIconPath } from "../../utils/assets";

const Chat = ({
    initialMessages = [],
    defaultOpen = true,
    targetAgent = null,
    initialMessage = null,
}: {
    initialMessages?: MessageType[];
    defaultOpen?: boolean;
    targetAgent?: string | null;
    initialMessage?: string | null;
}) => {
    const [messages, setMessages] = useState<MessageType[]>(initialMessages);
    const [isInitialLoading, setIsInitialLoading] = useState(
        initialMessages.length === 0
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(defaultOpen);
    const [lastUserMessageIndexWithError, setLastUserMessageIndexWithError] =
        useState<number | null>(null);
    const isSessionInitialized = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesListRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (messagesListRef.current) {
                const element = messagesListRef.current;
                // Scroll directo al final
                element.scrollTop = element.scrollHeight;
            }
        }, 200);
    };

    // Scroll automático cada vez que cambian los mensajes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Scroll cuando se abre el chat
    useEffect(() => {
        if (isChatOpen && messages.length > 0) {
            scrollToBottom();
        }
    }, [isChatOpen, messages.length]);

    // Inicializar sesión al montar el componente
    useEffect(() => {
        const initializeChat = async () => {
            if (isSessionInitialized.current) return;

            isSessionInitialized.current = true;

            const initResponse = await chatApiService.initializeSession(
                targetAgent,
                initialMessage
            );

            if (initResponse && initResponse.message) {
                // Agregar la respuesta inicial del bot a los mensajes
                const botInitMessage = chatApiService.createBotMessage(
                    initResponse.message,
                    initResponse.timestamp
                );

                setMessages((prevMessages) => [
                    ...prevMessages,
                    botInitMessage,
                ]);

                // Scroll para el mensaje inicial
                setTimeout(() => {
                    scrollToBottom();
                }, 300);
            }

            setIsInitialLoading(false);
        };

        initializeChat();
    }, [targetAgent, initialMessage]); // Se ejecuta al montar (o si cambia targetAgent)

    useEffect(() => {
        if (messages.length > 0) {
            setIsInitialLoading(false);
        }
    }, [messages.length]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleResendMessage = (messageIndex: number) => {
        const messageToResend = messages[messageIndex];
        if (
            messageToResend &&
            messageToResend.role === Author.USER &&
            !isLoading
        ) {
            // Resetear el estado de error inmediatamente
            setLastUserMessageIndexWithError(null);
            // Reenviar el mensaje
            handleMessage(messageToResend.content);
        }
    };

    const handleMessage = async (message: string) => {
        // No permitir nuevos mensajes mientras se está cargando
        if (isLoading) return;

        // Crear el mensaje del usuario
        const userMessage: MessageType = {
            content: message,
            role: Author.USER,
            timestamp: new Date(),
            img: null,
        };

        // Agregar el mensaje del usuario inmediatamente
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Establecer estado de carga y agregar mensaje de loader
        setIsLoading(true);
        const loadingMessage = chatApiService.createLoadingMessage();
        const loadingStartTime = Date.now();

        setMessages((prevMessages) => [...prevMessages, loadingMessage]);

        try {
            // Enviar mensaje a la API
            const apiResponse = await chatApiService.sendMessage({
                message: message,
                userId: "user-123", // En producción esto vendría del contexto de usuario
                conversationId: "conversation-123", // En producción esto se manejaría dinámicamente
            });

            // Calcular tiempo transcurrido y asegurar mínimo 1 segundo de "Escribiendo..."
            const elapsedTime = Date.now() - loadingStartTime;
            const minLoadingTime = 1000; // 1 segundo mínimo
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

            // Esperar el tiempo restante si es necesario
            if (remainingTime > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, remainingTime)
                );
            }

            // Remover mensaje de loading y agregar respuesta del bot
            setMessages((prevMessages) => {
                const messagesWithoutLoading = prevMessages.slice(0, -1);
                const botResponse = chatApiService.createBotMessage(
                    apiResponse.message,
                    apiResponse.timestamp,
                    apiResponse.imagen,
                    apiResponse.role,
                    apiResponse.is_finished,
                    apiResponse.loginUrl
                );
                console.log("Bot response:", botResponse);
                console.log("img", apiResponse.imagen);
                console.log("is_finished:", apiResponse.is_finished);
                console.log("loginUrl:", apiResponse.loginUrl);
                return [...messagesWithoutLoading, botResponse];
            });

            // Limpiar el estado de error ya que la respuesta fue exitosa
            setLastUserMessageIndexWithError(null);

            // El scroll se hace automáticamente por el useEffect cuando cambian los mensajes
        } catch (error) {
            // En caso de error, remover loading y mostrar mensaje de error
            const errorMessage =
                error instanceof Error ? error.message : "Error desconocido";

            setMessages((prevMessages) => {
                const messagesWithoutLoading = prevMessages.slice(0, -1);
                const errorResponse =
                    chatApiService.createErrorMessage(errorMessage);
                return [...messagesWithoutLoading, errorResponse];
            });

            // Guardar el índice del último mensaje del usuario que causó el error
            setMessages((prevMessages) => {
                // Encontrar el índice del último mensaje del usuario
                for (let i = prevMessages.length - 1; i >= 0; i--) {
                    if (prevMessages[i].role === Author.USER) {
                        setLastUserMessageIndexWithError(i);
                        break;
                    }
                }
                return prevMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="chat-wrapper w-full h-full">
            {isChatOpen ? (
                // Chat completo
                <section
                    className="chat-widget-floating w-full h-full bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col"
                    role="chat-container"
                    data-testid="chat-container"
                >
                    <article className="chat-header w-full flex items-center gap-4 px-4 py-3 border-b border-gray-300 bg-white rounded-t-lg">
                        <img
                            className="w-8 h-8"
                            src={getChatIconPath()}
                            alt=""
                        />
                        <h2 className="text-principal font-bold text-lg flex-1">
                            Chat de Viviendea
                        </h2>
                        <button
                            onClick={toggleChat}
                            className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
                            aria-label="Cerrar chat"
                        >
                            ×
                        </button>
                    </article>

                    <div
                        ref={messagesListRef}
                        aria-live="polite"
                        role="log"
                        className="messages-list p-4 gap-3 flex flex-col overflow-y-auto"
                        style={{
                            scrollBehavior: "smooth",
                            overflowAnchor: "none",
                            height: "400px",
                            maxHeight: "400px",
                            minHeight: "400px",
                            flexShrink: 1,
                        }}
                    >
                        {isInitialLoading && messages.length === 0 && (
                            <div className="text-center text-gray-500" aria-busy="true">
                                Cargando conversación...
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <Message
                                key={`${message.role}-${index}`}
                                content={message.content}
                                timestamp={message.timestamp}
                                role={message.role}
                                img={message.img}
                                showResendTooltip={
                                    index === lastUserMessageIndexWithError
                                }
                                onResend={() => handleResendMessage(index)}
                                loginUrl={message.loginUrl}
                                isFinished={message.isFinished}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <InputArea
                        onSendMessage={handleMessage}
                        disabled={
                            isLoading || isInitialLoading || messages.length === 0
                        }
                    />
                </section>
            ) : (
                // Icono circular flotante
                <button
                    onClick={toggleChat}
                    className="chat-toggle-btn absolute bottom-6 right-6 w-16 h-16 bg-white hover:scale-110 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 z-50 cursor-pointer"
                    aria-label="Abrir chat de Viviendea"
                >
                    <img
                        className="w-8 h-8"
                        src={getChatIconPath()}
                        alt="Chat de Viviendea"
                    />
                </button>
            )}
        </section>
    );
};

export default Chat;
