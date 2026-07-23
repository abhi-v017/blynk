export const FONT_OPTIONS = [
  { label: "Space Grotesk", value: "Space Grotesk", weights: "500;600;700" },
  { label: "Inter", value: "Inter", weights: "400;500;600;700" },
  { label: "Fraunces", value: "Fraunces", weights: "400;500;600;700" },
  { label: "Playfair Display", value: "Playfair Display", weights: "500;600;700" },
  { label: "JetBrains Mono", value: "JetBrains Mono", weights: "400;500;600" },
  { label: "DM Sans", value: "DM Sans", weights: "400;500;700" },
  { label: "Bebas Neue", value: "Bebas Neue", weights: "400" },
  { label: "Sora", value: "Sora", weights: "400;600;700" },
] as const;

export type FontValue = (typeof FONT_OPTIONS)[number]["value"];

function fontWeights(family: string) {
  return FONT_OPTIONS.find((f) => f.value === family)?.weights ?? "400;600";
}

/** Build a single Google Fonts stylesheet URL for two families used in a theme. */
export function buildGoogleFontsHref(display: string, body: string) {
  const families = new Set([display, body]);
  const parts = Array.from(families).map(
    (fam) => `family=${encodeURIComponent(fam)}:wght@${fontWeights(fam)}`
  );
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}
