import { describe, expect, it, vi } from "vitest";

vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));

import { signIn } from "next-auth/react";
import { makeStore } from "@/app/lib/store/store";
import {
  logIn,
  loginFormOpened,
  selectIsLoggingIn,
  selectLoginError,
  selectBalance,
  selectCurrentUser,
  selectIsLoggedIn,
  selectUserName,
  userLoaded,
  userSignedOut,
} from "@/app/lib/store/user_slice";
import { TEST_USER } from "@/tests/unit/helpers/store";

describe("user slice", () => {
  it("starts signed out", () => {
    const state = makeStore().getState();
    expect(selectCurrentUser(state)).toBeNull();
    expect(selectIsLoggedIn(state)).toBe(false);
    expect(selectUserName(state)).toBe("");
    expect(selectBalance(state)).toBeUndefined();
  });

  it("stores the loaded user", () => {
    const store = makeStore();
    store.dispatch(userLoaded(TEST_USER));
    const state = store.getState();
    expect(selectIsLoggedIn(state)).toBe(true);
    expect(selectUserName(state)).toBe("Анна");
    expect(selectBalance(state)).toBe(120);
  });

  it("uses the email when there is no name", () => {
    const store = makeStore();
    store.dispatch(userLoaded({ ...TEST_USER, name: "" }));
    expect(selectUserName(store.getState())).toBe(TEST_USER.email);
  });

  it("keeps the same state for identical data", () => {
    const store = makeStore();
    store.dispatch(userLoaded(TEST_USER));
    const before = selectCurrentUser(store.getState());
    store.dispatch(userLoaded({ ...TEST_USER }));
    expect(selectCurrentUser(store.getState())).toBe(before);
  });

  it("picks up a new balance", () => {
    const store = makeStore();
    store.dispatch(userLoaded(TEST_USER));
    store.dispatch(userLoaded({ ...TEST_USER, balance: 30 }));
    expect(selectBalance(store.getState())).toBe(30);
  });

  it("clears the user on sign out", () => {
    const store = makeStore();
    store.dispatch(userLoaded(TEST_USER));
    store.dispatch(userSignedOut());
    expect(selectIsLoggedIn(store.getState())).toBe(false);
  });

  describe("logIn", () => {
    const CREDENTIALS = {
      email: "anna@example.com",
      password: "secret1",
      callbackUrl: "/bookings",
    };

    it("resolves with the URL to continue to", async () => {
      vi.mocked(signIn).mockResolvedValue({
        url: "http://localhost/bookings",
      } as never);
      const store = makeStore();
      const pending = store.dispatch(logIn(CREDENTIALS));
      expect(selectIsLoggingIn(store.getState())).toBe(true);
      const result = await pending;

      expect(result.payload).toBe("http://localhost/bookings");
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "anna@example.com",
        password: "secret1",
        redirectTo: "/bookings",
        redirect: false,
      });
      expect(selectIsLoggingIn(store.getState())).toBe(false);
      expect(selectLoginError(store.getState())).toBeNull();
    });

    it("reports wrong credentials", async () => {
      vi.mocked(signIn).mockResolvedValue({
        error: "CredentialsSignin",
      } as never);
      const store = makeStore();
      await store.dispatch(logIn(CREDENTIALS));
      expect(selectLoginError(store.getState())).toBe("Invalid credentials.");
    });

    it("reports unexpected failures", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(signIn).mockRejectedValue(new Error("down"));
      const store = makeStore();
      await store.dispatch(logIn(CREDENTIALS));
      expect(selectLoginError(store.getState())).toBe("Something went wrong.");
    });

    it("forgets the error when the form is opened again", async () => {
      vi.mocked(signIn).mockResolvedValue({
        error: "CredentialsSignin",
      } as never);
      const store = makeStore();
      await store.dispatch(logIn(CREDENTIALS));
      store.dispatch(loginFormOpened());
      expect(selectLoginError(store.getState())).toBeNull();
    });
  });
});
