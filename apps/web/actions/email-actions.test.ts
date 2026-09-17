import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
}));

vi.mock("@/lib/resend", () => ({
  resend: { emails: { send: mocks.send } },
}));

vi.mock("@/components/email-template", () => ({
  EmailTemplate: () => null,
}));

const { sendEmail } = await import("./email-actions");

const baseArgs = {
  to: "user@test.com",
  username: "user",
  subject: "Hi",
  text: "body",
  buttonText: "Go",
  linkUrl: "https://x/magic?token=abc",
};

describe("sendEmail", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("EMAIL_FROM", "noreply@lavoiedelinfo.fr");
    mocks.send
      .mockReset()
      .mockResolvedValue({ data: { id: "email-1" }, error: null });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("throws when RESEND_API_KEY is not set", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    await expect(sendEmail(baseArgs)).rejects.toThrow(
      "RESEND_API_KEY environment variable is not set"
    );
  });

  it("throws when EMAIL_FROM is not set", async () => {
    vi.stubEnv("EMAIL_FROM", "");

    await expect(sendEmail(baseArgs)).rejects.toThrow(
      "EMAIL_FROM environment variable is not set"
    );
  });

  it("returns success when Resend accepts the send", async () => {
    const result = await sendEmail(baseArgs);

    expect(result).toEqual({ success: true });
  });

  it("returns a failure result when Resend resolves with an API-level error instead of throwing", async () => {
    // The Resend SDK doesn't throw for API-level errors (unverified domain,
    // invalid sender, etc.) — it resolves with { data: null, error }. A caller
    // that only checks for a thrown exception silently reports success here,
    // which is exactly what happened with this app's magic-link sign-in.
    mocks.send.mockResolvedValue({
      data: null,
      error: {
        name: "validation_error",
        message: "The lavoiedelinfo.fr domain is not verified.",
      },
    });

    const result = await sendEmail(baseArgs);

    expect(result).toEqual({
      success: false,
      message: "The lavoiedelinfo.fr domain is not verified.",
    });
  });

  it("returns a generic failure result when the Resend call itself throws", async () => {
    mocks.send.mockRejectedValue(new Error("network unreachable"));

    const result = await sendEmail(baseArgs);

    expect(result).toEqual({ success: false, message: "network unreachable" });
  });
});
