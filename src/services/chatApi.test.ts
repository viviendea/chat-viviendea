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
