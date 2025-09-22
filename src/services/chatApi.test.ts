import { describe, it, expect } from "vitest";
import { chatApiService } from "./chatApi";
import { Author } from "../types/chat";

describe("chatApiService", () => {
    describe("createLoadingMessage", () => {
        it("debería crear un mensaje de loading correcto", () => {
            const loadingMessage = chatApiService.createLoadingMessage();

            expect(loadingMessage.content).toBe("Escribiendo...");
            expect(loadingMessage.role).toBe(Author.ELE);
            expect(loadingMessage.img).toBeNull();
            expect(loadingMessage.timestamp).toBeInstanceOf(Date);
        });
    });

    describe("createBotMessage", () => {
        it("debería crear un mensaje del bot correcto", () => {
            const content = "Respuesta del bot";
            const botMessage = chatApiService.createBotMessage(content);

            expect(botMessage.content).toBe(content);
            expect(botMessage.role).toBe(Author.ELE);
            expect(botMessage.img).toBeNull();
            expect(botMessage.timestamp).toBeInstanceOf(Date);
        });

        it("debería usar el timestamp del servidor cuando se proporciona como Date", () => {
            const content = "Respuesta del bot";
            const serverTimestamp = new Date("2025-09-22T10:30:00.000Z");
            const botMessage = chatApiService.createBotMessage(content, serverTimestamp);

            expect(botMessage.content).toBe(content);
            expect(botMessage.role).toBe(Author.ELE);
            expect(botMessage.img).toBeNull();
            expect(botMessage.timestamp).toEqual(serverTimestamp);
            expect(botMessage.timestamp.getTime()).toBe(serverTimestamp.getTime());
        });

        it("debería usar el timestamp del servidor cuando se proporciona como string", () => {
            const content = "Respuesta del bot";
            const serverTimestampString = "2025-09-22T15:45:30.123Z";
            const expectedDate = new Date(serverTimestampString);
            const botMessage = chatApiService.createBotMessage(content, serverTimestampString);

            expect(botMessage.content).toBe(content);
            expect(botMessage.role).toBe(Author.ELE);
            expect(botMessage.img).toBeNull();
            expect(botMessage.timestamp).toEqual(expectedDate);
            expect(botMessage.timestamp.getTime()).toBe(expectedDate.getTime());
        });

        it("debería usar timestamp local cuando el servidor no proporciona timestamp", () => {
            const content = "Respuesta del bot";
            const beforeCall = new Date();
            const botMessage = chatApiService.createBotMessage(content);
            const afterCall = new Date();

            expect(botMessage.content).toBe(content);
            expect(botMessage.role).toBe(Author.ELE);
            expect(botMessage.img).toBeNull();
            expect(botMessage.timestamp).toBeInstanceOf(Date);
            expect(botMessage.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
            expect(botMessage.timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime());
        });

        it("debería manejar timestamp undefined usando fecha local", () => {
            const content = "Respuesta del bot";
            const beforeCall = new Date();
            const botMessage = chatApiService.createBotMessage(content, undefined);
            const afterCall = new Date();

            expect(botMessage.content).toBe(content);
            expect(botMessage.role).toBe(Author.ELE);
            expect(botMessage.img).toBeNull();
            expect(botMessage.timestamp).toBeInstanceOf(Date);
            expect(botMessage.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
            expect(botMessage.timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime());
        });
    });

    describe("createErrorMessage", () => {
        it("debería crear un mensaje de error correcto", () => {
            const error = "Error de conexión";
            const errorMessage = chatApiService.createErrorMessage(error);

            expect(errorMessage.content).toBe(
                `Lo siento, ocurrió un error: ${error}`
            );
            expect(errorMessage.role).toBe(Author.ELE);
            expect(errorMessage.img).toBeNull();
            expect(errorMessage.timestamp).toBeInstanceOf(Date);
        });
    });
});
