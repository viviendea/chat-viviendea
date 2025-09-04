import { render, screen } from "@testing-library/react";
import { describe, it, expect } from 'vitest';
import App from "../../App";

describe('Message Component', () => {
  it("renders Message component", () => {
    render(<App />);

    const messageContainer = screen.getByRole("message");

    expect(messageContainer).toBeInTheDocument();
  });
});