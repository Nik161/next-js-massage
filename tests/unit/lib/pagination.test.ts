import { describe, expect, it } from "vitest";
import { generatePagination } from "@/app/lib/pagination";

describe("generatePagination", () => {
  it("shows every page when there are 7 or fewer", () => {
    expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePagination(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the end when near the start", () => {
    expect(generatePagination(2, 10)).toEqual([1, 2, 3, "...", 9, 10]);
  });

  it("collapses the start when near the end", () => {
    expect(generatePagination(9, 10)).toEqual([1, 2, "...", 8, 9, 10]);
  });

  it("shows neighbours of the current page in the middle", () => {
    expect(generatePagination(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
  });
});
