import { render, screen } from "@testing-library/react";
import { describe, it, expect } from 'vitest';
import App from "../App";

describe('Hi Component', () => {
  it("renders Hi component", () => {
    render(<App />);

    const heading = screen.getByText("Hola que tal");

    expect(heading).toBeInTheDocument();
  });
});