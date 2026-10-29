// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type postgres from "postgres";

const sql = vi.hoisted(() => vi.fn());
vi.mock("@/app/lib/db", () => ({ sql }));

import { ApiError } from "@/app/lib/api/http";
import { chargeMinutes, resetWeeklyBalances } from "@/app/lib/balance";

const tx = vi.fn();
const asTx = tx as unknown as postgres.TransactionSql;

beforeEach(() => {
  sql.mockReset();
  tx.mockReset();
  tx.mockResolvedValue([{ id: "user-1" }]);
});

describe("chargeMinutes", () => {
  it("takes the minutes off the user's balance", async () => {
    await chargeMinutes(asTx, "user-1", 60);
    expect(tx.mock.calls[0].slice(1)).toEqual([60, "user-1", 60]);
  });

  it("refuses to go below zero", async () => {
    tx.mockResolvedValue([]);

    const error = await chargeMinutes(asTx, "user-1", 60).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
  });

  it("skips the query when nothing changes", async () => {
    await chargeMinutes(asTx, "user-1", 0);
    expect(tx).not.toHaveBeenCalled();
  });
});

describe("resetWeeklyBalances", () => {
  it("reports how many users were topped up", async () => {
    sql.mockResolvedValue([{ id: "user-1" }, { id: "user-2" }]);
    await expect(resetWeeklyBalances()).resolves.toBe(2);
  });
});
