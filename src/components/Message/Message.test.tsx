import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Message from "./Message";
import { Author } from "../../types/chat";

describe("Message Component", () => {
    /* CHECK FOR MESSAGE RENDERING */
    it("Renders Message component", () => {
        render(<Message content="Hello, world!" role={Author.USER} timestamp={new Date()} />);
        const message = screen.getByTestId("chat-message");
        expect(message).toBeInTheDocument();
    });

    /* CHECK FOR MESSAGE TEXT */
    it("Displays the correct message text", () => {
        render(
            <Message
                content="Hello, world!"
                role={Author.USER}
                timestamp={new Date()}
            />
        );

        const message = screen.getByTestId("chat-message");
        expect(message).toHaveTextContent("Hello, world!");
    });

    /* CHECK IMG MESSAGE */
    it("Displays the correct message image", () => {
        const imageUrl =
            "https://planos-spain.viviendea.com/?tecnico=0&planta=0&estancia=46&padding=50&opciones=124:54:22:7";

        render(
            <Message
                content="Hello, world!"
                role={Author.USER}
                timestamp={new Date()}
                img={imageUrl}
            />
        );

        const message = screen.getByTestId("chat-message");
        const image = screen.getByTestId("message-image");

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", imageUrl);
        expect(message).toHaveTextContent("Hello, world!");
    });
});
