import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Chat from "./Chat";
import { Author } from "../../types/chat";

describe("Chat Component", () => {
    it("renders Chat component", () => {
        render(<Chat />);

        const chat = screen.getByTestId("chat-container");
        expect(chat).toBeInTheDocument();
    });

    it("renders two Message components", () => {
        render(
            <Chat
                messages={[
                    {
                        content: "Hola",
                        role: Author.USER,
                        timestamp: new Date(),
                    },
                    {
                        content: "¡Hola! ¿En qué puedo ayudarte?",
                        role: Author.ELE,
                        timestamp: new Date(),
                    },
                ]}
            />
        );

        const messages = screen.getAllByTestId("chat-message");
        expect(messages.length).toBe(2);
    });
});
