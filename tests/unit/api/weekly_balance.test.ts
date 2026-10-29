// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const resetWeeklyBalances = vi.hoisted(() => vi.fn());
vi.mock("@/app/lib/balance", () => ({ resetWeeklyBalances }));

import { GET } from "@/app/api/cron/weekly-balance/route";

function cron(authorization?: string) {
  return GET(
    new Request("http://localhost/api/cron/weekly-balance", {
      headers: authorization ? { authorization } : {},
    }),
  );
}

beforeEach(() => {
  resetWeeklyBalances.mockReset();
  resetWeeklyBalances.mockResolvedValue(3);
  vi.stubEnv("CRON_SECRET", "secret");
});

describe("GET /api/cron/weekly-balance", () => {
  it("tops up the balances for Vercel Cron", async () => {
    const response = await cron("Bearer secret");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ updated: 3 });
  });

  it("rejects calls without the secret", async () => {
    expect((await cron()).status).toBe(401);
    expect((await cron("Bearer wrong")).status).toBe(401);
    expect(resetWeeklyBalances).not.toHaveBeenCalled();
  });

  it("stays closed when no secret is configured", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await cron("Bearer ")).status).toBe(401);
  });
});
