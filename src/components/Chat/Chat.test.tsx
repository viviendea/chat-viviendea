import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Chat from "./Chat";
import { Author } from "../../types/chat";
import { chatApiService } from "../../services/chatApi";

// Mock del hook useTypingLoop para evitar problemas con la animación en tests
vi.mock("../../hooks/useTypingLoop", () => ({
    useTypingLoop: vi.fn(({ text }: { text: string }) => ({
        displayText: text, // Devolver el texto completo inmediatamente
    })),
}));

// Mock del servicio de API
vi.mock("../../services/chatApi", () => ({
    chatApiService: {
        sendMessage: vi.fn(),
        initializeSession: vi.fn(() => Promise.resolve(null)),
        createLoadingMessage: vi.fn(() => ({
            content: "Pensando...",
            role: Author.ELE,
            timestamp: new Date(),
            img: null,
        })),
        createBotMessage: vi.fn((content: string) => ({
            content,
            role: Author.ELE,
            timestamp: new Date(),
            img: null,
        })),
        createErrorMessage: vi.fn((error: string) => ({
            content: `Lo siento, ocurrió un error: ${error}`,
            role: Author.ELE,
            timestamp: new Date(),
            img: null,
        })),
    },
}));

beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    vi.clearAllMocks();
});

describe("Chat Component", () => {
    it("renders chat toggle button when chat is closed", () => {
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
                defaultOpen={false}
            />
        );

        // El chat debe estar cerrado inicialmente
        expect(screen.getByRole("button", { name: "Abrir chat de Viviendea" })).toBeInTheDocument();
        expect(screen.queryByTestId("chat-container")).not.toBeInTheDocument();
        expect(screen.queryByText("Chat de Viviendea")).not.toBeInTheDocument();
    });

    it("renders chat open when defaultOpen is true", () => {
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
                defaultOpen={true}
            />
        );

        // El chat debe estar abierto inicialmente
        expect(screen.getByTestId("chat-container")).toBeInTheDocument();
        expect(screen.getByText("Chat de Viviendea")).toBeInTheDocument();
        expect(screen.getByText("Mensaje inicial")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Abrir chat de Viviendea" })).not.toBeInTheDocument();
    });

    it("opens chat when toggle button is clicked", async () => {
        const user = userEvent.setup();
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
                defaultOpen={false}
            />
        );

        const toggleButton = screen.getByRole("button", { name: "Abrir chat de Viviendea" });
        await user.click(toggleButton);

        // Verificar que el chat se abre
        expect(screen.getByTestId("chat-container")).toBeInTheDocument();
        expect(screen.getByText("Mensaje inicial")).toBeInTheDocument();
        expect(screen.getByText("Chat de Viviendea")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Abrir chat de Viviendea" })).not.toBeInTheDocument();
    });

    it("closes chat when close button is clicked", async () => {
        const user = userEvent.setup();
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
                defaultOpen={false}
            />
        );

        // Abrir el chat primero
        const toggleButton = screen.getByRole("button", { name: "Abrir chat de Viviendea" });
        await user.click(toggleButton);

        // Verificar que está abierto
        expect(screen.getByTestId("chat-container")).toBeInTheDocument();

        // Cerrar el chat
        const closeButton = screen.getByRole("button", { name: "Cerrar chat" });
        await user.click(closeButton);

        // Verificar que se cierra
        expect(screen.queryByTestId("chat-container")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Abrir chat de Viviendea" })).toBeInTheDocument();
    });

    it("handles message sending flow correctly", async () => {
        const user = userEvent.setup();
        const mockSendMessage = vi.mocked(chatApiService.sendMessage);
        
        // Mock con promesa controlable
        let resolvePromise!: (value: { message: string; conversationId: string; timestamp: string }) => void;
        const promise = new Promise<{ message: string; conversationId: string; timestamp: string }>((resolve) => {
            resolvePromise = resolve;
        });
        mockSendMessage.mockReturnValue(promise);

        render(<Chat initialMessages={[]} defaultOpen={true} />);

        // El chat ya está abierto, no necesitamos hacer click

        const textarea = screen.getByTestId("message-textarea");
        const sendButton = screen.getByTestId("send-button");

        // Enviar mensaje
        await user.type(textarea, "Test message");
        await user.click(sendButton);

        // Verificar comportamiento inmediato
        expect(textarea).toHaveValue(""); // Se limpia
        expect(textarea).toBeDisabled(); // Se deshabilita
        expect(sendButton).toBeDisabled();
        expect(screen.getByText("Test message")).toBeInTheDocument(); // Mensaje usuario
        expect(screen.getByText("Pensando...")).toBeInTheDocument(); // Loading

        // Verificar llamada a API
        expect(mockSendMessage).toHaveBeenCalledWith({
            message: "Test message",
            userId: "user-123",
            conversationId: "conversation-123",
        });

        // Resolver respuesta
        resolvePromise({ message: "Bot response", conversationId: "conv-123", timestamp: new Date().toISOString() });

        // Verificar resultado final
        await waitFor(() => {
            expect(screen.getByText("Bot response")).toBeInTheDocument();
            expect(screen.queryByText("Pensando...")).not.toBeInTheDocument();
            expect(textarea).not.toBeDisabled();
        });
    });

    it("handles API errors gracefully", async () => {
        const user = userEvent.setup();
        const mockSendMessage = vi.mocked(chatApiService.sendMessage);
        
        mockSendMessage.mockRejectedValue(new Error("Network error"));

        render(<Chat initialMessages={[]} defaultOpen={true} />);

        // El chat ya está abierto, no necesitamos hacer click

        const textarea = screen.getByTestId("message-textarea");
        const sendButton = screen.getByTestId("send-button");

        await user.type(textarea, "Test message");
        await user.click(sendButton);

        // Verificar manejo de error
        await waitFor(() => {
            expect(screen.getByText("Lo siento, ocurrió un error: Network error")).toBeInTheDocument();
            expect(screen.queryByText("Pensando...")).not.toBeInTheDocument();
            expect(textarea).not.toBeDisabled();
        });
    });

    it("prevents multiple messages while loading", async () => {
        const user = userEvent.setup();
        const mockSendMessage = vi.mocked(chatApiService.sendMessage);
        
        // Mock que nunca se resuelve para simular loading prolongado
        mockSendMessage.mockReturnValue(new Promise(() => {}));

        render(<Chat initialMessages={[]} defaultOpen={true} />);

        // El chat ya está abierto, no necesitamos hacer click

        const textarea = screen.getByTestId("message-textarea");
        const sendButton = screen.getByTestId("send-button");

        // Enviar primer mensaje
        await user.type(textarea, "First message");
        await user.click(sendButton);

        // Verificar que está en loading
        expect(screen.getByText("Pensando...")).toBeInTheDocument();
        expect(textarea).toBeDisabled();
        expect(sendButton).toBeDisabled();

        // Verificar que solo se llamó una vez
        expect(mockSendMessage).toHaveBeenCalledTimes(1);
    });
});
