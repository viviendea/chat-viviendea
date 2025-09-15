import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputArea } from "./InputArea";

describe("Input area Component", () => {
    it("renders Inputarea", () => {
        render(<InputArea />);

        const inputContainer = screen.getByTestId("input-area");
        expect(inputContainer).toBeInTheDocument();
    });

    it("renders send btn", () => {
        render(<InputArea />);

        const sendBtn = screen.getByTestId("send-button");
        expect(sendBtn).toBeInTheDocument();
    });

    it("renders textarea with correct attributes", () => {
        render(<InputArea />);

        const textarea = screen.getByTestId("message-textarea");
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveAttribute("placeholder", "Escribe un mensaje...");
    });

    it("updates textarea value when typing", async () => {
        const user = userEvent.setup();
        render(<InputArea />);

        const textarea = screen.getByTestId("message-textarea");
        await user.type(textarea, "Hola mundo");

        expect(textarea).toHaveValue("Hola mundo");
    });

    it("calls onSendMessage when send button is clicked with message", async () => {
        const mockOnSendMessage = vi.fn();
        const user = userEvent.setup();
        
        render(<InputArea onSendMessage={mockOnSendMessage} />);

        const textarea = screen.getByTestId("message-textarea");
        const sendBtn = screen.getByTestId("send-button");

        // Escribir mensaje
        await user.type(textarea, "Mensaje de prueba");
        
        // Hacer click en enviar
        await user.click(sendBtn);

        expect(mockOnSendMessage).toHaveBeenCalledWith("Mensaje de prueba");
        expect(textarea).toHaveValue(""); // El textarea debe limpiarse
    });

    it("does not call onSendMessage when message is empty or only whitespace", async () => {
        const mockOnSendMessage = vi.fn();
        const user = userEvent.setup();
        
        render(<InputArea onSendMessage={mockOnSendMessage} />);

        const sendBtn = screen.getByTestId("send-button");

        // Intentar enviar sin mensaje
        await user.click(sendBtn);
        expect(mockOnSendMessage).not.toHaveBeenCalled();

        // Intentar enviar con solo espacios
        const textarea = screen.getByTestId("message-textarea");
        await user.type(textarea, "   ");
        await user.click(sendBtn);
        
        expect(mockOnSendMessage).not.toHaveBeenCalled();
    });

    it("sends message when Enter is pressed (without Shift)", async () => {
        const mockOnSendMessage = vi.fn();
        const user = userEvent.setup();
        
        render(<InputArea onSendMessage={mockOnSendMessage} />);

        const textarea = screen.getByTestId("message-textarea");
        
        await user.type(textarea, "Mensaje con Enter");
        await user.keyboard("{Enter}");

        expect(mockOnSendMessage).toHaveBeenCalledWith("Mensaje con Enter");
        expect(textarea).toHaveValue("");
    });

    it("does not send message when Shift+Enter is pressed", async () => {
        const mockOnSendMessage = vi.fn();
        const user = userEvent.setup();
        
        render(<InputArea onSendMessage={mockOnSendMessage} />);

        const textarea = screen.getByTestId("message-textarea");
        
        await user.type(textarea, "Mensaje con Shift+Enter");
        await user.keyboard("{Shift>}{Enter}{/Shift}");

        expect(mockOnSendMessage).not.toHaveBeenCalled();
        expect(textarea).toHaveValue("Mensaje con Shift+Enter\n");
    });

    it("trims whitespace from message before sending", async () => {
        const mockOnSendMessage = vi.fn();
        const user = userEvent.setup();
        
        render(<InputArea onSendMessage={mockOnSendMessage} />);

        const textarea = screen.getByTestId("message-textarea");
        const sendBtn = screen.getByTestId("send-button");

        await user.type(textarea, "  Mensaje con espacios  ");
        await user.click(sendBtn);

        expect(mockOnSendMessage).toHaveBeenCalledWith("Mensaje con espacios");
    });

    it("disables send button when message is empty", () => {
        render(<InputArea />);

        const sendBtn = screen.getByTestId("send-button");
        expect(sendBtn).toBeDisabled();
    });

    it("enables send button when message has content", async () => {
        const user = userEvent.setup();
        render(<InputArea />);

        const textarea = screen.getByTestId("message-textarea");
        const sendBtn = screen.getByTestId("send-button");

        await user.type(textarea, "Mensaje");
        
        expect(sendBtn).not.toBeDisabled();
    });
});
