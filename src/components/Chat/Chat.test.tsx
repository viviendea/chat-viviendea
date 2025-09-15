import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Chat from "./Chat";
import { Author } from "../../types/chat";

// Mock scrollIntoView que no está disponible en jsdom
beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
});

describe("Chat Component", () => {
    it("renders Chat component", () => {
        render(<Chat />);

        const chat = screen.getByTestId("chat-container");
        expect(chat).toBeInTheDocument();
    });

    it("renders two Message components", () => {
        render(
            <Chat
                initialMessages={[
                    {
                        content: "Hola",
                        role: Author.USER,
                        timestamp: new Date(),
                        img: null,
                    },
                    {
                        content: "¡Hola! ¿En qué puedo ayudarte?",
                        role: Author.ELE,
                        timestamp: new Date(),
                        img: null,
                    },
                ]}
            />
        );

        const messages = screen.getAllByTestId("chat-message");
        expect(messages.length).toBe(2);
    });

    it("adds new message to array and displays it when handleMessage is called", async () => {
        const user = userEvent.setup();
        
        // Renderizar el chat con un mensaje inicial
        render(
            <Chat
                initialMessages={[
                    {
                        content: "Mensaje inicial",
                        role: Author.ELE,
                        timestamp: new Date(),
                        img: null,
                    },
                ]}
            />
        );

        // Verificar que inicialmente hay 1 mensaje
        let messages = screen.getAllByTestId("chat-message");
        expect(messages.length).toBe(1);
        expect(screen.getByText("Mensaje inicial")).toBeInTheDocument();

        // Escribir un mensaje en el textarea
        const textarea = screen.getByTestId("message-textarea");
        await user.type(textarea, "Mensaje de prueba del usuario");

        // Hacer click en el botón de enviar
        const sendButton = screen.getByTestId("send-button");
        await user.click(sendButton);

        // Verificar que ahora hay 2 mensajes
        messages = screen.getAllByTestId("chat-message");
        expect(messages.length).toBe(2);

        // Verificar que el nuevo mensaje se muestra en pantalla
        expect(screen.getByText("Mensaje de prueba del usuario")).toBeInTheDocument();

        // Verificar que el textarea se limpió
        expect(textarea).toHaveValue("");
    });
});
