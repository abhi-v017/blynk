"use client";

import { useEditorStore } from "@/lib/editor-store";
import { Field, ColorInput, SegmentedControl, Panel } from "@/components/ui";
import ImageUpload from "@/components/ImageUpload";
import { THEME_PRESETS } from "@/lib/presets";
import { FONT_OPTIONS } from "@/lib/fonts";
import { ThemeConfig } from "@/lib/types";
import {
  Palette,
  Droplets,
  Image as ImageIcon,
  Square,
  Circle,
  PaintBucket,
  Layout,
  AppWindow,
  AlignJustify,
  Grid,
  Minus,
  Wind,
  ArrowUp,
  Sparkles,
  Hexagon,
  EyeOff,
  Wand2,
  Smile,
  Check,
} from "lucide-react";

function FontSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all cursor-pointer"
    >
      {FONT_OPTIONS.map((f) => (
        <option key={f.value} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  );
}

export default function ThemePage() {
  const { theme, setTheme, setThemeDeep } = useEditorStore();
  if (!theme) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-text mb-0.5 sm:mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Theme & Appearance
        </h1>
        <p className="text-xs text-muted">
          Pick a minimal pastel preset or customize individual colors, typography, buttons, and layout.
        </p>
      </div>

      {/* Presets Gallery */}
      <Panel
        title="Minimal Presets"
        description="Curated single-color and soft pastel starting directions"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {THEME_PRESETS.map((preset) => {
            const isSelected = theme.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  setTheme({ ...preset.theme, userId: theme.userId, presetId: preset.id } as ThemeConfig)
                }
                className={`text-left rounded-xl border p-3.5 transition-all relative overflow-hidden flex flex-col justify-between h-24 active:scale-[0.99] ${
                  isSelected
                    ? "border-accent ring-1 ring-accent/30 shadow-xs"
                    : "border-border hover:border-muted/60 opacity-90 hover:opacity-100"
                }`}
                style={{
                  background:
                    preset.theme.background.type === "gradient"
                      ? `linear-gradient(135deg, ${preset.theme.background.color}, ${preset.theme.background.color2})`
                      : preset.theme.background.color,
                }}
              >
                <div className="flex items-start justify-between w-full">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: preset.theme.font.color, fontFamily: "var(--font-display)" }}
                  >
                    {preset.name}
                  </span>
                  {isSelected && (
                    <span
                      className="p-1 rounded-full text-[10px]"
                      style={{
                        backgroundColor: preset.theme.button.bgColor,
                        color: preset.theme.button.textColor,
                      }}
                    >
                      <Check size={11} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
                <div
                  className="text-[11px] leading-tight line-clamp-2"
                  style={{ color: preset.theme.font.mutedColor }}
                >
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      {/* Background Options */}
      <Panel title="Canvas & Background" description="Single color, subtle gradient, or image backdrop">
        <Field label="Background Style">
          <SegmentedControl
            value={theme.background.type}
            onChange={(v) => setThemeDeep("background", { type: v })}
            options={[
              { label: "Single Color", value: "color", icon: <Palette size={14} /> },
              { label: "Subtle Gradient", value: "gradient", icon: <Droplets size={14} /> },
              { label: "Image", value: "image", icon: <ImageIcon size={14} /> },
            ]}
          />
        </Field>

        {theme.background.type !== "image" && (
          <Field label={theme.background.type === "gradient" ? "Primary Color" : "Background Color"}>
            <ColorInput
              value={theme.background.color}
              onChange={(v) => setThemeDeep("background", { color: v })}
            />
          </Field>
        )}

        {theme.background.type === "gradient" && (
          <>
            <Field label="Secondary Color">
              <ColorInput
                value={theme.background.color2}
                onChange={(v) => setThemeDeep("background", { color2: v })}
              />
            </Field>
            <Field label="Gradient Angle" hint={`${theme.background.gradientAngle}°`}>
              <input
                type="range"
                min={0}
                max={360}
                value={theme.background.gradientAngle}
                onChange={(e) => setThemeDeep("background", { gradientAngle: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer py-1"
              />
            </Field>
          </>
        )}

        {theme.background.type === "image" && (
          <>
            <Field label="Backdrop Image">
              <ImageUpload
                value={theme.background.imageUrl}
                onChange={(v) => setThemeDeep("background", { imageUrl: v })}
                aspectRatio={9 / 16}
                folder="themes"
              />
            </Field>
            <Field label="Dark Dimmer Overlay" hint={`${Math.round(theme.background.overlay * 100)}%`}>
              <input
                type="range"
                min={0}
                max={90}
                value={theme.background.overlay * 100}
                onChange={(e) => setThemeDeep("background", { overlay: Number(e.target.value) / 100 })}
                className="w-full accent-accent cursor-pointer py-1"
              />
            </Field>
          </>
        )}
      </Panel>

      {/* Typography Options */}
      <Panel title="Typography" description="Paired Google fonts and text sizing">
        <Field label="Display Font (Name)">
          <FontSelect
            value={theme.font.family}
            onChange={(v) => setThemeDeep("font", { family: v })}
          />
        </Field>
        <Field label="Body Font (Bio & Links)">
          <FontSelect
            value={theme.font.bodyFamily}
            onChange={(v) => setThemeDeep("font", { bodyFamily: v })}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Heading Color">
            <ColorInput
              value={theme.font.color}
              onChange={(v) => setThemeDeep("font", { color: v })}
            />
          </Field>
          <Field label="Muted Color">
            <ColorInput
              value={theme.font.mutedColor}
              onChange={(v) => setThemeDeep("font", { mutedColor: v })}
            />
          </Field>
        </div>
        <Field label="Scale Size">
          <SegmentedControl
            value={theme.font.size}
            onChange={(v) => setThemeDeep("font", { size: v })}
            options={[
              { label: "Compact", value: "sm" },
              { label: "Regular", value: "md" },
              { label: "Large", value: "lg" },
            ]}
          />
        </Field>
      </Panel>

      {/* Buttons */}
      <Panel title="Buttons & Links" description="Corner rounding, outline or fill, and contrast colors">
        <Field label="Corner Shape">
          <SegmentedControl
            value={theme.button.shape}
            onChange={(v) => setThemeDeep("button", { shape: v })}
            options={[
              { label: "Sharp", value: "sharp", icon: <Square size={14} /> },
              { label: "Soft", value: "soft", icon: <AppWindow size={14} /> },
              { label: "Pill", value: "pill", icon: <Circle size={14} /> },
            ]}
          />
        </Field>

        <Field label="Button Fill">
          <SegmentedControl
            value={theme.button.fill}
            onChange={(v) => setThemeDeep("button", { fill: v })}
            options={[
              { label: "Solid", value: "solid", icon: <PaintBucket size={14} /> },
              { label: "Outline", value: "outline", icon: <Layout size={14} /> },
              { label: "Frosted Glass", value: "glass", icon: <AppWindow size={14} /> },
            ]}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Button Background / Border">
            <ColorInput
              value={theme.button.bgColor}
              onChange={(v) => setThemeDeep("button", { bgColor: v, borderColor: v })}
            />
          </Field>
          <Field label="Button Text Color">
            <ColorInput
              value={theme.button.textColor}
              onChange={(v) => setThemeDeep("button", { textColor: v })}
            />
          </Field>
        </div>

        <Field label="Vertical Spacing">
          <SegmentedControl
            value={theme.button.spacing}
            onChange={(v) => setThemeDeep("button", { spacing: v })}
            options={[
              { label: "Tight", value: "compact" },
              { label: "Normal", value: "normal" },
              { label: "Roomy", value: "roomy" },
            ]}
          />
        </Field>

        <Field label="Link Badges / Icons">
          <SegmentedControl
            value={theme.button.iconStyle || "none"}
            onChange={(v) => setThemeDeep("button", { iconStyle: v })}
            options={[
              { label: "None", value: "none", icon: <EyeOff size={14} /> },
              { label: "Auto Favicon", value: "auto", icon: <Wand2 size={14} /> },
              { label: "Custom Emoji", value: "custom", icon: <Smile size={14} /> },
            ]}
          />
        </Field>
      </Panel>

      {/* Layout & Motion */}
      <Panel title="Layout & Motion" description="Grid format and subtle entry animations">
        <Field label="Link Arrangement">
          <SegmentedControl
            value={theme.layout}
            onChange={(v) => setTheme({ layout: v })}
            options={[
              { label: "Vertical Stack", value: "stack", icon: <AlignJustify size={14} /> },
              { label: "2-Column Grid", value: "grid", icon: <Grid size={14} /> },
            ]}
          />
        </Field>

        <Field label="Entry Animation">
          <SegmentedControl
            value={theme.animation}
            onChange={(v) => setTheme({ animation: v })}
            options={[
              { label: "None", value: "none", icon: <Minus size={14} /> },
              { label: "Soft Fade", value: "fade", icon: <Wind size={14} /> },
              { label: "Rise", value: "rise", icon: <ArrowUp size={14} /> },
              { label: "Pop", value: "pop", icon: <Sparkles size={14} /> },
            ]}
          />
        </Field>

        <Field label="Avatar Shape">
          <SegmentedControl
            value={theme.avatarShape}
            onChange={(v) => setTheme({ avatarShape: v })}
            options={[
              { label: "Circle", value: "circle", icon: <Circle size={14} /> },
              { label: "Soft Square", value: "square", icon: <Square size={14} /> },
              { label: "Squircle", value: "squircle", icon: <Hexagon size={14} /> },
            ]}
          />
        </Field>
      </Panel>
    </div>
  );
}
