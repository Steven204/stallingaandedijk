import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    vehicle: { findUnique: vi.fn() },
    storageLocation: { findUnique: vi.fn(), update: vi.fn() },
    vehiclePlacement: { updateMany: vi.fn(), create: vi.fn(), findFirst: vi.fn() },
    vehicle2: { update: vi.fn() },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

describe("POST /api/checkin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);

    const { POST } = await import("@/app/api/checkin/route");
    const request = new Request("http://localhost/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licensePlate: "AB-123-CD", locationCode: "A01" }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(401);
  });

  it("returns 401 for CUSTOMER role", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "CUSTOMER", email: "test@test.nl", name: "Test" },
      expires: "",
    } as any);

    const { POST } = await import("@/app/api/checkin/route");
    const request = new Request("http://localhost/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licensePlate: "AB-123-CD", locationCode: "A01" }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(401);
  });

  it("returns 400 without required fields", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "ADMIN", email: "admin@test.nl", name: "Admin" },
      expires: "",
    } as any);

    const { POST } = await import("@/app/api/checkin/route");
    const request = new Request("http://localhost/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it("returns 404 for unknown license plate", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "ADMIN", email: "admin@test.nl", name: "Admin" },
      expires: "",
    } as any);
    vi.mocked(prisma.vehicle.findUnique).mockResolvedValue(null);

    const { POST } = await import("@/app/api/checkin/route");
    const request = new Request("http://localhost/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licensePlate: "ZZ-999-ZZ", locationCode: "A01" }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(404);
  });
});
