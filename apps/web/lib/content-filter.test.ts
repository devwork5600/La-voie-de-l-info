import { describe, expect, it } from "vitest";

import { isBlocked } from "./content-filter";

describe("isBlocked", () => {
  it("blocks a title containing a sensitive keyword", () => {
    expect(isBlocked("Il est condamné pour corruption de mineur")).toBe(true);
  });

  it("is case- and accent-insensitive", () => {
    expect(isBlocked("SUICIDE d'un adolescent")).toBe(true);
    expect(isBlocked("Une agression SEXUELLE dénoncée")).toBe(true);
  });

  it("does not block an ordinary news title", () => {
    expect(
      isBlocked(
        "Ligue Europa : Lyon débute sa campagne par un succès sur Anderlecht"
      )
    ).toBe(false);
  });
});
