import type postgres from "postgres";
import { sql } from "@/app/lib/db";
import { ApiError } from "@/app/lib/api/http";

export const NOT_ENOUGH_BALANCE_MESSAGE =
  "Недостаточно минут на балансе для этой записи.";

// Takes `minutes` off the user's balance, a negative amount gives them back.
// Runs inside the booking's transaction, so a failed booking keeps the balance.
export async function chargeMinutes(
  tx: postgres.TransactionSql,
  userId: string,
  minutes: number,
) {
  if (minutes === 0) return;

  const rows = await tx`
    UPDATE users
    SET balance = COALESCE(balance, 0) - ${minutes}
    WHERE id = ${userId} AND COALESCE(balance, 0) >= ${minutes}
    RETURNING id
  `;
  if (rows.length === 0) throw new ApiError(400, NOT_ENOUGH_BALANCE_MESSAGE);
}

// Weekly top-up: every user with a weekly allowance starts the week with it.
// Unused minutes do not carry over.
export async function resetWeeklyBalances() {
  const rows = await sql`
    UPDATE users
    SET balance = weekly_balance
    WHERE weekly_balance IS NOT NULL
    RETURNING id
  `;
  return rows.length;
}
