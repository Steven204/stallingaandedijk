import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before importing
vi.mock("@/lib/prisma", () => ({
  prisma: {
    seasonConfig: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

// Import after mock
const { isDateInClosedSeason } = await import("@/lib/seasons");

describe("isDateInClosedSeason", () => {
  beforeEach(() => {
    vi.mocked(prisma.seasonConfig.findMany).mockResolvedValue([
      {
        id: "1",
        name: "Winterperiode",
        startMonth: 11,
        startDay: 15,
        endMonth: 3,
        endDay: 15,
        isClosedForPickup: true,
      },
    ]);
  });

  it("returns closed for date in winter (December)", async () => {
    const result = await isDateInClosedSeason(new Date("2026-12-25"));
    expect(result.closed).toBe(true);
    expect(result.seasonName).toBe("Winterperiode");
  });

  it("returns closed for date in winter (January)", async () => {
    const result = await isDateInClosedSeason(new Date("2027-01-15"));
    expect(result.closed).toBe(true);
  });

  it("returns closed for start of winter (Nov 15)", async () => {
    const result = await isDateInClosedSeason(new Date("2026-11-15"));
    expect(result.closed).toBe(true);
  });

  it("returns closed for end of winter (Mar 15)", async () => {
    const result = await isDateInClosedSeason(new Date("2027-03-15"));
    expect(result.closed).toBe(true);
  });

  it("returns open for date in summer (June)", async () => {
    const result = await isDateInClosedSeason(new Date("2026-06-15"));
    expect(result.closed).toBe(false);
  });

  it("returns open for date just after winter (Mar 16)", async () => {
    const result = await isDateInClosedSeason(new Date("2027-03-16"));
    expect(result.closed).toBe(false);
  });

  it("returns open for date just before winter (Nov 14)", async () => {
    const result = await isDateInClosedSeason(new Date("2026-11-14"));
    expect(result.closed).toBe(false);
  });

  it("returns open when no seasons configured", async () => {
    vi.mocked(prisma.seasonConfig.findMany).mockResolvedValue([]);
    const result = await isDateInClosedSeason(new Date("2026-12-25"));
    expect(result.closed).toBe(false);
  });
});
