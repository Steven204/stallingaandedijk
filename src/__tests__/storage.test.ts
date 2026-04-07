import { describe, it, expect } from "vitest";
import path from "path";

// Replicate the sanitization logic from storage.ts
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/\.\./g, "").replace(/[^a-zA-Z0-9\-_\/\.]/g, "");
}

describe("storage security", () => {
  it("strips path traversal sequences", () => {
    expect(sanitizeFileName("../../etc/passwd")).not.toContain("..");
    expect(sanitizeFileName("..%2F..%2Fetc")).not.toContain("..");
    expect(sanitizeFileName("foo/../bar")).not.toContain("..");
  });

  it("path stays within upload directory after sanitization", () => {
    const uploadDir = path.join("/app", "public", "uploads");
    const malicious = "../../etc/passwd";
    const safe = sanitizeFileName(malicious);
    const filePath = path.join(uploadDir, safe);

    // After sanitization + path.join, the result must still be inside uploadDir
    expect(filePath.startsWith(uploadDir)).toBe(true);
  });

  it("preserves valid filenames", () => {
    expect(sanitizeFileName("AB-123-CD/1234567890-A01.jpg"))
      .toBe("AB-123-CD/1234567890-A01.jpg");
  });

  it("strips special characters", () => {
    const result = sanitizeFileName("AB-123-CD/<script>alert(1)</script>.jpg");
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).not.toContain("(");
    expect(result).not.toContain(")");
  });

  it("handles empty filename", () => {
    expect(sanitizeFileName("")).toBe("");
  });
});
