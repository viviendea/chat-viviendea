import { useState, useRef, useEffect } from "react";
import { Author, type MessageType } from "../../types/chat";
import { InputArea } from "../InputArea/InputArea";
import Message from "../Message/Message";

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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessage = (message: string) => {
        const newMessage: MessageType = {
            content: message,
            role: Author.USER,
            timestamp: new Date(),
            img: null,
        };
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };
    return (
        <section className="chat-wrapper flex flex-col items-center justify-center min-h-screen">
            <section
                className="relative bg-white lg:w-3xl xl:w-4xl 2xl:w-5xl border border-gray-300 rounded-lg shadow-lg flex flex-col justify-between h-[100vh] lg:h-[90vh]"
                role="chat-container"
                data-testid="chat-container"
            >
                <article className="chat-header w-full flex items-center gap-4 px-4 py-1 border-b border-gray-300 top-0 left-0 right-0 bg-white z-10 sticky">
                    <img className="w-[50px]" src="/chat-icon.png" alt="" />
                    <h2 className=" text-principal font-bold text-lg md:text-xl">
                        Chat de Viviendea
                    </h2>
                </article>

                <div
                    aria-live="polite"
                    role="log"
                    className="messages-list p-6 gap-4 flex flex-col mt-6 overflow-scroll"
                >
                    {messages.map((message, index) => (
                        <Message
                            key={`${message.role}-${index}`}
                            content={message.content}
                            timestamp={message.timestamp}
                            role={message.role}
                            img={message.img}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <InputArea onSendMessage={handleMessage}/>
            </section>
        </section>
    );
};

export default Chat;
