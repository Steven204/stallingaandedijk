import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: { updateMany: vi.fn() },
    contract: { findMany: vi.fn() },
    appointment: { findMany: vi.fn() },
    priceConfig: { findFirst: vi.fn() },
    contract2: { update: vi.fn(), create: vi.fn() },
    invoice2: { create: vi.fn() },
  },
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(),
}));

import { prisma } from "@/lib/prisma";

describe("GET /api/cron/daily", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.CRON_SECRET;
  });

  it("returns 401 with wrong cron secret", async () => {
    process.env.CRON_SECRET = "correct-secret";

    const { GET } = await import("@/app/api/cron/daily/route");
    const request = new Request("http://localhost/api/cron/daily", {
      headers: { authorization: "Bearer wrong-secret" },
    });

    const response = await GET(request as any);
    expect(response.status).toBe(401);
  });

  it("allows request without CRON_SECRET in dev", async () => {
    vi.mocked(prisma.invoice.updateMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.contract.findMany).mockResolvedValue([]);
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

    const { GET } = await import("@/app/api/cron/daily/route");
    const request = new Request("http://localhost/api/cron/daily");

    const response = await GET(request as any);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("marks overdue invoices", async () => {
    vi.mocked(prisma.invoice.updateMany).mockResolvedValue({ count: 3 });
    vi.mocked(prisma.contract.findMany).mockResolvedValue([]);
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

    const { GET } = await import("@/app/api/cron/daily/route");
    const request = new Request("http://localhost/api/cron/daily");

    const response = await GET(request as any);
    const data = await response.json();

    expect(data.overdueInvoices).toBe(3);
    expect(prisma.invoice.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "PENDING" }),
        data: { status: "OVERDUE" },
      })
    );
  });
});
