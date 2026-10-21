// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  verifyCredentials: vi.fn(),
  getUserById: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/app/lib/credentials", () => ({
  verifyCredentials: mocks.verifyCredentials,
}));
vi.mock("@/app/lib/data/users", () => ({ getUserById: mocks.getUserById }));

import { POST } from "@/app/api/auth/token/route";
import { GET as getMe } from "@/app/api/me/route";

const USER = { id: "user-1", name: "Анна", email: "a@b.c", role: "user" };

function login(body: unknown) {
  return POST(
    new Request("http://localhost/api/auth/token", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

function me(headers: Record<string, string> = {}) {
  return getMe(new Request("http://localhost/api/me", { headers }));
}

beforeEach(() => {
  vi.stubEnv("AUTH_SECRET", "test-secret-test-secret-test-secret");
  mocks.auth.mockResolvedValue(null);
  mocks.verifyCredentials.mockResolvedValue(USER);
  mocks.getUserById.mockImplementation(async (id: string) =>
    id === USER.id ? USER : undefined,
  );
});

describe("POST /api/auth/token", () => {
  it("rejects wrong credentials", async () => {
    mocks.verifyCredentials.mockResolvedValue(null);
    const response = await login({ email: "a@b.c", password: "wrong" });
    expect(response.status).toBe(401);
  });

  it("issues a token that authenticates later requests", async () => {
    const response = await login({ email: "a@b.c", password: "secret1" });
    const { token, user } = await response.json();

    expect(user).toEqual(USER);
    const meResponse = await me({ authorization: `Bearer ${token}` });
    await expect(meResponse.json()).resolves.toEqual({ user: USER });
  });
});

describe("GET /api/me", () => {
  it("rejects a forged token", async () => {
    const response = await me({ authorization: "Bearer forged" });
    expect(response.status).toBe(401);
  });

  it("falls back to the session cookie", async () => {
    mocks.auth.mockResolvedValue({ user: { id: USER.id } });
    const response = await me();
    await expect(response.json()).resolves.toEqual({ user: USER });
  });

  it("rejects anonymous requests", async () => {
    const response = await me();
    expect(response.status).toBe(401);
  });
});
