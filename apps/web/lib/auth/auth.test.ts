import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendEmail: vi.fn(),
  betterAuthCtor: vi.fn((_options: unknown) => ({})),
  prismaAdapter: vi.fn(),
  magicLink: vi.fn(),
  nextCookies: vi.fn(() => ({})),
}));

vi.mock("@lvdi/database", () => ({ db: {} }));
vi.mock("@/actions/email-actions", () => ({ sendEmail: mocks.sendEmail }));
vi.mock("better-auth", () => ({ betterAuth: mocks.betterAuthCtor }));
vi.mock("better-auth/adapters/prisma", () => ({
  prismaAdapter: mocks.prismaAdapter,
}));
vi.mock("better-auth/next-js", () => ({ nextCookies: mocks.nextCookies }));
vi.mock("better-auth/plugins", () => ({
  magicLink: mocks.magicLink.mockImplementation((opts: unknown) => ({
    id: "magic-link",
    opts,
  })),
}));

type SendMagicLink = (args: { email: string; url: string }) => Promise<void>;
type SendChangeEmailVerification = (args: {
  user: { email: string; name?: string | null };
  newEmail: string;
  url: string;
  token: string;
}) => Promise<void>;

async function loadAuthOptions() {
  return import("./auth");
}

function getSendMagicLink(): SendMagicLink {
  const opts = mocks.magicLink.mock.calls[0][0] as {
    sendMagicLink: SendMagicLink;
  };
  return opts.sendMagicLink;
}

function getSendChangeEmailVerification(): SendChangeEmailVerification {
  const options = mocks.betterAuthCtor.mock.calls[0][0] as {
    user: {
      changeEmail: { sendChangeEmailVerification: SendChangeEmailVerification };
    };
  };
  return options.user.changeEmail.sendChangeEmailVerification;
}

beforeEach(() => {
  vi.resetModules();
  mocks.sendEmail.mockReset().mockResolvedValue({ success: true });
  mocks.betterAuthCtor.mockClear();
  mocks.magicLink.mockClear();
});

describe("sendMagicLink", () => {
  it("throws with the failure message when sendEmail reports failure", async () => {
    mocks.sendEmail.mockResolvedValue({
      success: false,
      message: "domain not verified",
    });
    await loadAuthOptions();
    const sendMagicLink = getSendMagicLink();

    await expect(
      sendMagicLink({
        email: "jane@test.com",
        url: "https://x/magic?token=abc",
      })
    ).rejects.toThrow("domain not verified");
  });

  it("falls back to a generic message when sendEmail fails without one", async () => {
    mocks.sendEmail.mockResolvedValue({ success: false });
    await loadAuthOptions();
    const sendMagicLink = getSendMagicLink();

    await expect(
      sendMagicLink({
        email: "jane@test.com",
        url: "https://x/magic?token=abc",
      })
    ).rejects.toThrow("Failed to send magic link");
  });

  it("does not throw when sendEmail succeeds", async () => {
    await loadAuthOptions();
    const sendMagicLink = getSendMagicLink();

    await expect(
      sendMagicLink({
        email: "jane@test.com",
        url: "https://x/magic?token=abc",
      })
    ).resolves.toBeUndefined();
  });
});

describe("sendChangeEmailVerification", () => {
  it("throws with the failure message when sendEmail reports failure", async () => {
    mocks.sendEmail.mockResolvedValue({
      success: false,
      message: "rate limited",
    });
    await loadAuthOptions();
    const sendChangeEmailVerification = getSendChangeEmailVerification();

    await expect(
      sendChangeEmailVerification({
        user: { email: "jane@test.com", name: "Jane" },
        newEmail: "jane.new@test.com",
        url: "https://x/approve?token=abc",
        token: "abc",
      })
    ).rejects.toThrow("rate limited");
  });

  it("does not throw when sendEmail succeeds", async () => {
    await loadAuthOptions();
    const sendChangeEmailVerification = getSendChangeEmailVerification();

    await expect(
      sendChangeEmailVerification({
        user: { email: "jane@test.com", name: "Jane" },
        newEmail: "jane.new@test.com",
        url: "https://x/approve?token=abc",
        token: "abc",
      })
    ).resolves.toBeUndefined();
  });
});
