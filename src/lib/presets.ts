import { ThemePreset, ThemeConfig } from "./types";

export const PASTEL_PALETTE = [
  { name: "Sage", hex: "#EAEFE9", text: "#1F2922" },
  { name: "Oat", hex: "#F7F4EE", text: "#26221D" },
  { name: "Lavender", hex: "#F2EFF8", text: "#271F36" },
  { name: "Sky", hex: "#EAF0F6", text: "#192433" },
  { name: "Blush", hex: "#F8ECEE", text: "#2B1D20" },
  { name: "Sand", hex: "#F3EFE6", text: "#2B261F" },
  { name: "Cloud", hex: "#F8FAFC", text: "#0F172A" },
  { name: "Charcoal", hex: "#17191C", text: "#F3F4F6" },
] as const;

export const DEFAULT_THEME: ThemePreset["theme"] = {
  background: {
    type: "color",
    color: "#EAEFE9",
    color2: "#DDE5DC",
    gradientAngle: 180,
    imageUrl: "",
    overlay: 0.2,
  },
  font: {
    family: "Space Grotesk",
    bodyFamily: "Inter",
    color: "#1F2922",
    mutedColor: "#5A6B5F",
    size: "md",
  },
  button: {
    shape: "soft",
    fill: "solid",
    bgColor: "#1F2922",
    textColor: "#EAEFE9",
    borderColor: "#1F2922",
    spacing: "normal",
    iconStyle: "auto",
  },
  layout: "stack",
  animation: "fade",
  avatarShape: "circle",
};

export function normalizeTheme(raw: unknown, userId: string): ThemeConfig {
  const t = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const bg = (t.background && typeof t.background === "object" ? t.background : {}) as Record<string, unknown>;
  const font = (t.font && typeof t.font === "object" ? t.font : {}) as Record<string, unknown>;
  const btn = (t.button && typeof t.button === "object" ? t.button : {}) as Record<string, unknown>;

  const shapeRaw = btn.shape;
  const safeShape =
    shapeRaw === "sharp" || shapeRaw === "pill"
      ? shapeRaw
      : "soft";

  const fillRaw = btn.fill;
  const safeFill =
    fillRaw === "outline" || fillRaw === "glass" ? fillRaw : "solid";

  const safeBgColor =
    typeof btn.bgColor === "string" && btn.bgColor
      ? btn.bgColor
      : typeof btn.color === "string" && btn.color
      ? btn.color
      : DEFAULT_THEME.button.bgColor;

  const safeTextColor =
    typeof btn.textColor === "string" && btn.textColor
      ? btn.textColor
      : DEFAULT_THEME.button.textColor;

  const safeBorderColor =
    typeof btn.borderColor === "string" && btn.borderColor
      ? btn.borderColor
      : safeBgColor;

  return {
    userId,
    presetId: typeof t.presetId === "string" ? t.presetId : "sage-minimal",
    background: {
      type: bg.type === "gradient" || bg.type === "image" ? bg.type : "color",
      color: typeof bg.color === "string" && bg.color ? bg.color : DEFAULT_THEME.background.color,
      color2: typeof bg.color2 === "string" && bg.color2 ? bg.color2 : DEFAULT_THEME.background.color2,
      gradientAngle: typeof bg.gradientAngle === "number" ? bg.gradientAngle : DEFAULT_THEME.background.gradientAngle,
      imageUrl: typeof bg.imageUrl === "string" ? bg.imageUrl : DEFAULT_THEME.background.imageUrl,
      overlay: typeof bg.overlay === "number" ? bg.overlay : DEFAULT_THEME.background.overlay,
    },
    font: {
      family: typeof font.family === "string" && font.family ? font.family : DEFAULT_THEME.font.family,
      bodyFamily: typeof font.bodyFamily === "string" && font.bodyFamily ? font.bodyFamily : DEFAULT_THEME.font.bodyFamily,
      color: typeof font.color === "string" && font.color ? font.color : DEFAULT_THEME.font.color,
      mutedColor: typeof font.mutedColor === "string" && font.mutedColor ? font.mutedColor : DEFAULT_THEME.font.mutedColor,
      size: font.size === "sm" || font.size === "lg" ? font.size : "md",
    },
    button: {
      shape: safeShape,
      fill: safeFill,
      bgColor: safeBgColor,
      textColor: safeTextColor,
      borderColor: safeBorderColor,
      spacing: btn.spacing === "compact" || btn.spacing === "roomy" ? btn.spacing : "normal",
      iconStyle: btn.iconStyle === "none" || btn.iconStyle === "custom" ? btn.iconStyle : "auto",
    },
    layout: t.layout === "grid" ? "grid" : "stack",
    animation: t.animation === "pop" || t.animation === "rise" || t.animation === "none" ? t.animation : "fade",
    avatarShape: t.avatarShape === "square" || t.avatarShape === "squircle" ? t.avatarShape : "circle",
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "sage-minimal",
    name: "Sage Minimal",
    description: "Soft pastel sage canvas, deep slate type, quiet organic balance.",
    theme: DEFAULT_THEME,
  },
  {
    id: "paper-oat",
    name: "Paper & Oat",
    description: "Warm linen paper, editorial serif type, crisp outline buttons.",
    theme: {
      background: {
        type: "color",
        color: "#F7F4EE",
        color2: "#EDE7DC",
        gradientAngle: 180,
        imageUrl: "",
        overlay: 0.1,
      },
      font: {
        family: "Fraunces",
        bodyFamily: "Inter",
        color: "#26221D",
        mutedColor: "#6E665D",
        size: "md",
      },
      button: {
        shape: "soft",
        fill: "outline",
        bgColor: "transparent",
        textColor: "#26221D",
        borderColor: "#26221D",
        spacing: "roomy",
        iconStyle: "none",
      },
      layout: "stack",
      animation: "rise",
      avatarShape: "square",
    },
  },
  {
    id: "soft-lavender",
    name: "Soft Lavender",
    description: "Gentle pastel violet, deep ink contrast, soft pill buttons.",
    theme: {
      background: {
        type: "color",
        color: "#F2EFF8",
        color2: "#E5E0F0",
        gradientAngle: 180,
        imageUrl: "",
        overlay: 0.1,
      },
      font: {
        family: "Space Grotesk",
        bodyFamily: "Inter",
        color: "#271F36",
        mutedColor: "#6C627F",
        size: "md",
      },
      button: {
        shape: "pill",
        fill: "solid",
        bgColor: "#271F36",
        textColor: "#F2EFF8",
        borderColor: "#271F36",
        spacing: "normal",
        iconStyle: "none",
      },
      layout: "stack",
      animation: "fade",
      avatarShape: "circle",
    },
  },
  {
    id: "powder-sky",
    name: "Powder Sky",
    description: "Pale powder blue, deep navy accents, clean squircle avatar.",
    theme: {
      background: {
        type: "color",
        color: "#EAF0F6",
        color2: "#D8E3EF",
        gradientAngle: 180,
        imageUrl: "",
        overlay: 0.15,
      },
      font: {
        family: "Space Grotesk",
        bodyFamily: "Inter",
        color: "#192433",
        mutedColor: "#57687E",
        size: "md",
      },
      button: {
        shape: "soft",
        fill: "solid",
        bgColor: "#192433",
        textColor: "#EAF0F6",
        borderColor: "#192433",
        spacing: "normal",
        iconStyle: "auto",
      },
      layout: "stack",
      animation: "fade",
      avatarShape: "squircle",
    },
  },
  {
    id: "clean-charcoal",
    name: "Clean Charcoal",
    description: "Matte dark charcoal, crisp neutral borders, minimal and quiet.",
    theme: {
      background: {
        type: "color",
        color: "#17191C",
        color2: "#1F2227",
        gradientAngle: 180,
        imageUrl: "",
        overlay: 0.2,
      },
      font: {
        family: "Space Grotesk",
        bodyFamily: "Inter",
        color: "#F3F4F6",
        mutedColor: "#9098A6",
        size: "md",
      },
      button: {
        shape: "soft",
        fill: "outline",
        bgColor: "transparent",
        textColor: "#F3F4F6",
        borderColor: "#373C44",
        spacing: "normal",
        iconStyle: "none",
      },
      layout: "stack",
      animation: "none",
      avatarShape: "squircle",
    },
  },
];
