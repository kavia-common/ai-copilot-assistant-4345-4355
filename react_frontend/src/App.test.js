import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app heading and ask button", () => {
  render(<App />);

  // Assert the stable heading present in App.js
  expect(screen.getByRole("heading", { name: /AI Copilot/i })).toBeInTheDocument();

  // Assert the Ask button label
  expect(screen.getByRole("button", { name: /Ask/i })).toBeInTheDocument();

  // Optional: ensure the "Your question" label exists
  expect(screen.getByLabelText(/Your question/i)).toBeInTheDocument();
});
