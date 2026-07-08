import { describe, expect, it } from "vitest";

import { MagicLinkSignInSchema } from "./email-schemas";

describe("MagicLinkSignInSchema", () => {
  it("accepts a valid email", () => {
    expect(
      MagicLinkSignInSchema.safeParse({ email: "user@example.com" }).success
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      MagicLinkSignInSchema.safeParse({ email: "not-an-email" }).success
    ).toBe(false);
  });

  it("rejects a missing email", () => {
    expect(MagicLinkSignInSchema.safeParse({}).success).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(MagicLinkSignInSchema.safeParse({ email: "" }).success).toBe(false);
  });
});
