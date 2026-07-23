export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  profilePic: string; // URL or empty
  createdAt: number;
  published: boolean;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
  icon?: string; // optional emoji/key
}

export type BackgroundType = "color" | "gradient" | "image";
export type LayoutType = "stack" | "grid";
export type AnimationType = "none" | "fade" | "rise" | "pop";
export type ButtonShape = "sharp" | "soft" | "pill";
export type ButtonFill = "solid" | "outline" | "glass";

export interface ThemeConfig {
  userId: string;
  presetId: string; // which preset this was derived from, or "custom"

  background: {
    type: BackgroundType;
    color: string; // used if type=color, or gradient stop 1
    color2: string; // gradient stop 2
    gradientAngle: number;
    imageUrl: string;
    overlay: number; // 0-1 darken overlay for image bg
  };

  font: {
    family: string; // display font for name
    bodyFamily: string;
    color: string;
    mutedColor: string;
    size: "sm" | "md" | "lg";
  };

  button: {
    shape: ButtonShape;
    fill: ButtonFill;
    bgColor: string;
    textColor: string;
    borderColor: string;
    spacing: "compact" | "normal" | "roomy";
    iconStyle?: "none" | "auto" | "custom";
  };

  layout: LayoutType;
  animation: AnimationType;
  avatarShape: "circle" | "square" | "squircle";
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: Omit<ThemeConfig, "userId" | "presetId">;
}
