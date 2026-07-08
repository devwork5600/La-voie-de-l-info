import { describe, expect, it } from "vitest";

import { ContactMessageSchema } from "./contact-schemas";

const validMessage = {
  name: "Adrien",
  email: "adrien@example.com",
  subject: "Une question",
  message: "Ceci est un message de test suffisamment long.",
};

describe("ContactMessageSchema", () => {
  it("accepts a fully valid message", () => {
    expect(ContactMessageSchema.safeParse(validMessage).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(
      ContactMessageSchema.safeParse({ ...validMessage, name: "A" }).success
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      ContactMessageSchema.safeParse({ ...validMessage, email: "not-an-email" })
        .success
    ).toBe(false);
  });

  it("rejects a subject shorter than 3 characters", () => {
    expect(
      ContactMessageSchema.safeParse({ ...validMessage, subject: "ab" }).success
    ).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    expect(
      ContactMessageSchema.safeParse({ ...validMessage, message: "short" })
        .success
    ).toBe(false);
  });

  it("rejects a missing field", () => {
    const withoutName: Partial<typeof validMessage> = { ...validMessage };
    delete withoutName.name;
    expect(ContactMessageSchema.safeParse(withoutName).success).toBe(false);
  });
});
