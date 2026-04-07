import { describe, it, expect } from "vitest";
import { getPaginationParams, PAGE_SIZE } from "@/lib/pagination";

describe("getPaginationParams", () => {
  it("returns page 1 defaults when no params", () => {
    const result = getPaginationParams({});
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(PAGE_SIZE);
  });

  it("calculates skip for page 2", () => {
    const result = getPaginationParams({ page: "2" });
    expect(result.page).toBe(2);
    expect(result.skip).toBe(PAGE_SIZE);
    expect(result.take).toBe(PAGE_SIZE);
  });

  it("calculates skip for page 5", () => {
    const result = getPaginationParams({ page: "5" });
    expect(result.page).toBe(5);
    expect(result.skip).toBe(PAGE_SIZE * 4);
  });

  it("clamps negative page to 1", () => {
    const result = getPaginationParams({ page: "-3" });
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });

  it("clamps zero to 1", () => {
    const result = getPaginationParams({ page: "0" });
    expect(result.page).toBe(1);
  });

  it("handles non-numeric input", () => {
    const result = getPaginationParams({ page: "abc" });
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });
});
