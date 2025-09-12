import { render, screen } from "@testing-library/react";
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
});
