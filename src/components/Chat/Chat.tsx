import { Author, type MessageType } from "../../types/chat";
import Message from "../Message/Message";

const Chat = ({
    messages = [
        { content: "Hola", role: Author.ELE, timestamp: new Date(), img: null },
        {
            content: "¡Hola! ¿En qué puedo ayudarte?",
            role: Author.ELE,
            timestamp: new Date(),
            img: null,
        },
    ],
}: {
    messages?: MessageType[];
}) => {
    return (
        <section className="chat-wrapper flex flex-col items-center justify-center min-h-screen">
            <section
                className="relative bg-white md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl border border-gray-300 rounded-lg shadow-lg h-5/12"
                role="chat-container"
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
                    className="messages-list p-6 gap-4 flex flex-col max-h-full mt-6 overflow-scroll"
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
                </div>

                <div className="h-[150px] w-full p-4 sticky bottom-0 left-0 right-0 bg-white border-t border-gray-300ƒ">
                    <textarea
                        className=" text-start border-principal w-full h-full p-2 border rounded-lg"
                        placeholder="Escribe un mensaje..."
                        id="w3review"
                        name="w3review"
                        rows="4"
                        cols="50"
                    >
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Atque non excepturi sit perspiciatis praesentium
                        eius nihil. Ratione, ipsam quae. Natus rem delectus
                        dolores, consequatur quod rerum iusto odit excepturi
                        repellendus!
                    </textarea>
                </div>
            </section>
        </section>
    );
};

export default Chat;
