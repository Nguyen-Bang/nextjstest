import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the async AuthButton component
vi.mock("@/components/auth-button", () => ({
  AuthButton: () => (
    <div>
      <a href="/auth/login">Sign in</a>
      <a href="/auth/sign-up">Sign up</a>
    </div>
  ),
}));

// Mock ThemeSwitcher to avoid any theme provider dependencies
vi.mock("@/components/theme-switcher", () => ({
  ThemeSwitcher: () => null,
}));

describe("Landing page", () => {
  it("renders h1 with 'Notes' text and auth links", async () => {
    const { default: Home } = await import("@/app/page");

    const jsx = Home();
    render(jsx);

    // Check h1 heading
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Notes");

    // Check for auth links/buttons (Sign in + Sign up)
    const signInLinks = screen.getAllByRole("link", { name: /sign in/i });
    const signUpLinks = screen.getAllByRole("link", { name: /sign up/i });
    expect(signInLinks.length).toBeGreaterThanOrEqual(1);
    expect(signUpLinks.length).toBeGreaterThanOrEqual(1);
  });
});
