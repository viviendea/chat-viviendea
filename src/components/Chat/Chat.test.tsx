import { render, screen } from "@testing-library/react";
import { describe, it, expect } from 'vitest';
import App from "../../App";

describe('Chat Component', () => {
  it("renders Chat component", () => {
    render(<App />);

    const chatContainer = screen.getByRole("chat-container");

    expect(chatContainer).toBeInTheDocument();
  });
});