import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Chat from "./Chat";
import { Author } from "../../types/chat";
import {
    chatApiService,
} from "../../services/chatApi";

// Mock del servicio de API
vi.mock("../../services/chatApi", () => ({
    chatApiService: {
        sendMessage: vi.fn(),
        createLoadingMessage: vi.fn(() => ({
            content: "Escribiendo...",
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

// Mock scrollIntoView que no está disponible en jsdom
beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
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

        // Mock de la API con promesa controlable
        const mockSendMessage = vi.mocked(chatApiService.sendMessage);
        let resolvePromise!: (value: { response: string; conversationId: string }) => void;
        const promise = new Promise<{ response: string; conversationId: string }>((resolve) => {
            resolvePromise = resolve;
        });
        mockSendMessage.mockReturnValue(promise);

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
        const messages = screen.getAllByTestId("chat-message");
        expect(messages.length).toBe(1);
        expect(screen.getByText("Mensaje inicial")).toBeInTheDocument();

        // Escribir un mensaje en el textarea
        const textarea = screen.getByTestId("message-textarea");
        await user.type(textarea, "Mensaje de prueba del usuario");

        // Hacer click en el botón de enviar
        const sendButton = screen.getByTestId("send-button");
        await user.click(sendButton);

        // Verificar que el textarea se limpió inmediatamente
        expect(textarea).toHaveValue("");

        // Verificar que se muestra el mensaje del usuario
        expect(
            screen.getByText("Mensaje de prueba del usuario")
        ).toBeInTheDocument();

        // Verificar que se muestra el loader
        expect(screen.getByText("Escribiendo...")).toBeInTheDocument();

        // Resolver la promesa para simular respuesta de la API
        resolvePromise({
            response: "Respuesta del bot",
            conversationId: "conv-123",
        });

        // Esperar a que se resuelva la promesa y se muestre la respuesta del bot
        await waitFor(() => {
            expect(screen.getByText("Respuesta del bot")).toBeInTheDocument();
        });

        // Verificar que el loader ya no está presente
        expect(screen.queryByText("Escribiendo...")).not.toBeInTheDocument();

        // Verificar que se llamó al servicio de API
        expect(mockSendMessage).toHaveBeenCalledWith({
            message: "Mensaje de prueba del usuario",
            userId: "user-123",
            conversationId: "conversation-123",
        });
    });

    it("muestra mensaje de error cuando la API falla", async () => {
        const user = userEvent.setup();

        // Mock de error de la API que tarda un poco en fallar
        const mockSendMessage = vi.mocked(chatApiService.sendMessage);
        let rejectPromise: (error: Error) => void;
        const promise = new Promise<{
            response: string;
            conversationId: string;
        }>((_, reject) => {
            rejectPromise = reject;
        });
        mockSendMessage.mockReturnValue(promise);

        render(<Chat initialMessages={[]} />);

        // Escribir un mensaje y enviarlo
        const textarea = screen.getByTestId("message-textarea");
        await user.type(textarea, "Mensaje de prueba");

        const sendButton = screen.getByTestId("send-button");
        await user.click(sendButton);

        // Verificar que se muestra el loader inicialmente
        expect(screen.getByText("Escribiendo...")).toBeInTheDocument();

        // Rechazar la promesa con un error
        rejectPromise!(new Error("Error de conexión"));

        // Esperar a que se muestre el mensaje de error
        await waitFor(() => {
            expect(
                screen.getByText(
                    "Lo siento, ocurrió un error: Error de conexión"
                )
            ).toBeInTheDocument();
        });

        // Verificar que el loader ya no está presente
        expect(screen.queryByText("Escribiendo...")).not.toBeInTheDocument();
    });

    it("deshabilita el input mientras está cargando", async () => {
        const user = userEvent.setup();

        // Mock que tarda en resolverse
        const mockSendMessage = vi.mocked(chatApiService.sendMessage);
        let resolvePromise: (value: {
            response: string;
            conversationId: string;
        }) => void;
        const promise = new Promise<{
            response: string;
            conversationId: string;
        }>((resolve) => {
            resolvePromise = resolve;
        });
        mockSendMessage.mockReturnValue(promise);

        render(<Chat initialMessages={[]} />);

        const textarea = screen.getByTestId("message-textarea");
        const sendButton = screen.getByTestId("send-button");

        // Escribir un mensaje y enviarlo
        await user.type(textarea, "Mensaje de prueba");
        await user.click(sendButton);

        // Verificar que el input está deshabilitado
        expect(textarea).toBeDisabled();
        expect(sendButton).toBeDisabled();

        // Resolver la promesa
        resolvePromise!({
            response: "Respuesta del bot",
            conversationId: "conv-123",
        });

        // Esperar a que se resuelva y verificar que el input se habilita
        await waitFor(() => {
            expect(textarea).not.toBeDisabled();
        });

        // El botón seguirá deshabilitado porque no hay texto, pero ya no por la prop disabled
        // Para verificar que ya no está por disabled, escribimos algo
        await user.type(textarea, "Nuevo mensaje");
        await waitFor(() => {
            expect(sendButton).not.toBeDisabled();
        });
    });

    it("no permite enviar nuevos mensajes mientras está cargando", async () => {
        const user = userEvent.setup();

        // Mock que tarda en resolverse
        const mockSendMessage = vi.mocked(chatApiService.sendMessage);
        let resolvePromise: (value: {
            response: string;
            conversationId: string;
        }) => void;
        const promise = new Promise<{
            response: string;
            conversationId: string;
        }>((resolve) => {
            resolvePromise = resolve;
        });
        mockSendMessage.mockReturnValue(promise);

        render(<Chat initialMessages={[]} />);

        const textarea = screen.getByTestId("message-textarea");
        const sendButton = screen.getByTestId("send-button");

        // Escribir un mensaje y enviarlo
        await user.type(textarea, "Primer mensaje");
        await user.click(sendButton);

        // Verificar que se muestra el loader
        expect(screen.getByText("Escribiendo...")).toBeInTheDocument();

        // Verificar que se llamó una vez al servicio
        expect(mockSendMessage).toHaveBeenCalledTimes(1);

        // El textarea debería estar vacío después del envío
        expect(textarea).toHaveValue("");

        // Intentar escribir y enviar otro mensaje (debería estar disabled)
        // Como está disabled, no debería poder escribir
        expect(textarea).toBeDisabled();
        expect(sendButton).toBeDisabled();

        // Resolver la promesa
        resolvePromise!({
            response: "Respuesta del bot",
            conversationId: "conv-123",
        });

        await waitFor(() => {
            expect(
                screen.queryByText("Escribiendo...")
            ).not.toBeInTheDocument();
        });

        // Verificar que solo se llamó una vez durante todo el test
        expect(mockSendMessage).toHaveBeenCalledTimes(1);
    });
});
