// Basic safety net for the auto-published news ticker: no human reviews these
// headlines before they go live (unlike Article, which requires admin
// validation), so anything matching stays out rather than risking something
// graphic/sensitive on the homepage unattended. Not a moderation system —
// just a coarse keyword blocklist. Update this list directly if something
// slips through or gets over-blocked.
const BLOCKED_KEYWORDS = [
  // violence / mort
  "meurtre",
  "assassin",
  "égorg",
  "décapit",
  "cadavre",
  "carnage",
  "massacre",
  "torture",
  "mutilé",
  "mutilation",
  // agressions sexuelles
  "viol",
  "violée",
  "violeur",
  "agression sexuelle",
  "pédophil",
  "inceste",
  // suicide / automutilation
  "suicide",
  "suicidé",
  "s'est donné la mort",
  "automutilation",
  // autres contenus sensibles
  "pornograph",
  "explicite",
];

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function isBlocked(title: string): boolean {
  const normalized = normalize(title);
  return BLOCKED_KEYWORDS.some((keyword) =>
    normalized.includes(normalize(keyword))
  );
}
