import { useState, useRef, useEffect } from "react";
import { Author, type MessageType } from "../../types/chat";
import { InputArea } from "../InputArea/InputArea";
import Message from "../Message/Message";
import { chatApiService } from "../../services/chatApi";
import { getChatIconPath } from "../../utils/assets";

const Chat = ({
    initialMessages = [
        { content: "Hola", role: Author.ELE, timestamp: new Date(), img: null },
        {
            content: "¡Hola! ¿En qué puedo ayudarte?",
            role: Author.ELE,
            timestamp: new Date(),
            img: null,
        },
    ],
}: {
    initialMessages?: MessageType[];
}) => {
    const [messages, setMessages] = useState<MessageType[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        setMessages(prevMessages => [...prevMessages, userMessage]);
        
        // Establecer estado de carga y agregar mensaje de loader
        setIsLoading(true);
        const loadingMessage = chatApiService.createLoadingMessage();
        
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        try {
            // Enviar mensaje a la API
            const apiResponse = await chatApiService.sendMessage({
                message: message,
                userId: 'user-123', // En producción esto vendría del contexto de usuario
                conversationId: 'conversation-123' // En producción esto se manejaría dinámicamente
            });

            // Remover mensaje de loading y agregar respuesta del bot
            setMessages(prevMessages => {
                const messagesWithoutLoading = prevMessages.slice(0, -1);
                const botResponse = chatApiService.createBotMessage(
                    apiResponse.response, 
                    apiResponse.timestamp
                );
                return [...messagesWithoutLoading, botResponse];
            });

        } catch (error) {
            // En caso de error, remover loading y mostrar mensaje de error
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            
            setMessages(prevMessages => {
                const messagesWithoutLoading = prevMessages.slice(0, -1);
                const errorResponse = chatApiService.createErrorMessage(errorMessage);
                return [...messagesWithoutLoading, errorResponse];
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="chat-wrapper flex flex-col items-center justify-center min-h-screen">
            <section
                className="relative bg-white lg:w-3xl xl:w-4xl 2xl:w-5xl border border-gray-300 rounded-lg shadow-lg flex flex-col justify-between h-[100vh] lg:h-[90vh]"
                role="chat-container"
                data-testid="chat-container"
            >
                <article className="chat-header w-full flex items-center gap-4 px-4 py-1 border-b border-gray-300 top-0 left-0 right-0 bg-white z-10 sticky">
                    <img className="w-[50px]" src={getChatIconPath()} alt="" />
                    <h2 className=" text-principal font-bold text-lg md:text-xl">
                        Chat de Viviendea
                    </h2>
                </article>

                <div
                    aria-live="polite"
                    role="log"
                    className="messages-list p-6 gap-4 flex flex-col mt-6 overflow-scroll"
                >
                    {messages.map((message, index) => {
                        // Encontrar el índice del último mensaje que no es del usuario
                        const lastNonUserMessageIndex = messages
                            .map((msg, i) => ({ msg, index: i }))
                            .filter(({ msg }) => msg.role !== Author.USER)
                            .pop()?.index;
                        
                        const isLastMessage = index === lastNonUserMessageIndex && message.role !== Author.USER;
                        
                        return (
                            <Message
                                key={`${message.role}-${index}`}
                                content={message.content}
                                timestamp={message.timestamp}
                                role={message.role}
                                img={message.img}
                                isLastMessage={isLastMessage}
                            />
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <InputArea onSendMessage={handleMessage} disabled={isLoading}/>
            </section>
        </section>
    );
};

export default Chat;
