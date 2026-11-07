import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));
vi.mock("@/app/lib/navigation", () => ({ navigateWithReload: vi.fn() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("callbackUrl=/bookings/create"),
}));

import { signIn } from "next-auth/react";
import { navigateWithReload } from "@/app/lib/navigation";
import LoginForm from "@/app/ui/login/login_form";
import { makeTestStore, storeWrapper } from "@/tests/unit/helpers/store";

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText("Email"), "anna@example.com");
  await userEvent.type(screen.getByLabelText("Пароль"), "secret1");
  await userEvent.click(screen.getByRole("button", { name: /Войти/ }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(navigateWithReload).mockClear();
  });

  it("signs in and loads the requested page", async () => {
    vi.mocked(signIn).mockResolvedValue({
      url: "http://localhost/bookings/create",
    } as never);
    render(<LoginForm />, { wrapper: storeWrapper(makeTestStore(null)) });

    await fillAndSubmit();

    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({
        email: "anna@example.com",
        password: "secret1",
        redirectTo: "/bookings/create",
      }),
    );
    // A full load, not router.push: see app/lib/navigation.ts
    expect(navigateWithReload).toHaveBeenCalledWith(
      "http://localhost/bookings/create",
    );
  });

  it("shows the error and stays on the page", async () => {
    vi.mocked(signIn).mockResolvedValue({
      error: "CredentialsSignin",
    } as never);
    render(<LoginForm />, { wrapper: storeWrapper(makeTestStore(null)) });

    await fillAndSubmit();

    expect(await screen.findByText("Invalid credentials.")).toBeInTheDocument();
    expect(navigateWithReload).not.toHaveBeenCalled();
  });

  it("does not show an error from an earlier visit", async () => {
    vi.mocked(signIn).mockResolvedValue({
      error: "CredentialsSignin",
    } as never);
    const wrapper = storeWrapper(makeTestStore(null));
    const first = render(<LoginForm />, { wrapper });
    await fillAndSubmit();
    await screen.findByText("Invalid credentials.");
    first.unmount();

    render(<LoginForm />, { wrapper });
    expect(screen.queryByText("Invalid credentials.")).not.toBeInTheDocument();
  });
});
