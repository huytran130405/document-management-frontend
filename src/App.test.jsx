import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";

describe("application shell", () => {
  it("keeps focus in the form when switching modes on mobile", async () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: query.includes("max-width"),
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByRole("button", { name: "Log in" }));
      const dialog = screen.getByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: "Sign up" }));
      expect(
        screen.getByRole("heading", { name: "Create your account" }),
      ).toHaveFocus();
    } finally {
      window.matchMedia.mockImplementation(() => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      }));
    }
  });
  it("keeps account actions in the header and can collapse the sidebar", async () => {
    const user = userEvent.setup();
    render(<App />);
    const sidebar = screen.getByRole("complementary");
    expect(
      within(sidebar).queryByRole("button", { name: "Log in" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close sidebar" }));
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(sidebar).toHaveAttribute("inert");
    // jsdom does not apply responsive CSS, so select the desktop control explicitly.
    const openButton = screen
      .getAllByRole("button", { name: "Open sidebar" })
      .find(
        (button) => button.getAttribute("aria-controls") === "desktop-sidebar",
      );
    await user.click(openButton);
    expect(sidebar).toBeVisible();
    expect(sidebar).not.toHaveAttribute("inert");
  });

  it("opens the requested form and clears fields when switching modes", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Log in" }));
    const dialog = screen.getByRole("dialog", { name: "Welcome back" });
    await user.type(
      within(dialog).getByLabelText("Email"),
      "person@example.com",
    );
    await user.type(within(dialog).getByLabelText("Password"), "a-password");
    await user.click(within(dialog).getByRole("button", { name: "Sign up" }));
    expect(
      screen.getByRole("heading", { name: "Create your account" }),
    ).toBeVisible();
    expect(within(dialog).getByLabelText("Email")).toHaveValue("");
    expect(within(dialog).getByLabelText("Password")).toHaveValue("");
    await user.click(
      within(dialog).getByRole("button", { name: "Close form" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  for (const action of ["Log in", "Sign up"]) {
    it(`validates input and only shows a demo result for ${action}`, async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByRole("button", { name: action }));
      const dialog = screen.getByRole("dialog");
      const submit = within(dialog).getByRole("button", {
        name: action,
        exact: true,
      });
      await user.click(submit);
      expect(
        within(dialog).getByText("Enter your email address."),
      ).toBeVisible();
      expect(within(dialog).getByLabelText("Email")).toHaveFocus();
      await user.type(within(dialog).getByLabelText("Email"), "not-an-email");
      await user.type(within(dialog).getByLabelText("Password"), "a-password");
      await user.click(submit);
      expect(
        within(dialog).getByText("Enter a valid email address."),
      ).toBeVisible();
      await user.clear(within(dialog).getByLabelText("Email"));
      await user.type(
        within(dialog).getByLabelText("Email"),
        "person@example.com",
      );
      await user.click(submit);
      expect(within(dialog).getByRole("status")).toHaveTextContent("Demo only");
      expect(within(dialog).getByLabelText("Password")).toHaveValue("");
    });
  }
});
