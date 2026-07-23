"use client";

import { useEditorStore } from "@/lib/editor-store";
import { Field, TextInput, ColorInput, SegmentedControl, Panel } from "@/components/ui";
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
} from "lucide-react";

function FontSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
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
    <div>
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Theme
      </h1>
      <p className="text-sm text-muted mb-6">
        Start from a preset, then push it wherever you want. Every change shows up live on the right.
      </p>

      <Panel title="Presets">
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() =>
                setTheme({ ...preset.theme, userId: theme.userId, presetId: preset.id } as ThemeConfig)
              }
              className={`text-left rounded-lg border p-3 transition-colors ${
                theme.presetId === preset.id ? "border-accent" : "border-border hover:border-muted"
              }`}
              style={{
                background:
                  preset.theme.background.type === "gradient"
                    ? `linear-gradient(135deg, ${preset.theme.background.color}, ${preset.theme.background.color2})`
                    : preset.theme.background.color,
              }}
            >
              <div
                className="text-xs font-semibold mb-0.5"
                style={{ color: preset.theme.font.color, fontFamily: "var(--font-display)" }}
              >
                {preset.name}
              </div>
              <div className="text-[10.5px] leading-snug" style={{ color: preset.theme.font.mutedColor }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Background">
        <Field label="Type">
          <SegmentedControl
            value={theme.background.type}
            onChange={(v) => setThemeDeep("background", { type: v })}
            options={[
              { label: "Color", value: "color", icon: <Palette size={16} /> },
              { label: "Gradient", value: "gradient", icon: <Droplets size={16} /> },
              { label: "Image", value: "image", icon: <ImageIcon size={16} /> },
            ]}
          />
        </Field>

        {theme.background.type !== "image" && (
          <Field label={theme.background.type === "gradient" ? "Color 1" : "Color"}>
            <ColorInput value={theme.background.color} onChange={(v) => setThemeDeep("background", { color: v })} />
          </Field>
        )}

        {theme.background.type === "gradient" && (
          <>
            <Field label="Color 2">
              <ColorInput value={theme.background.color2} onChange={(v) => setThemeDeep("background", { color2: v })} />
            </Field>
            <Field label="Angle" hint={`${theme.background.gradientAngle}°`}>
              <input
                type="range"
                min={0}
                max={360}
                value={theme.background.gradientAngle}
                onChange={(e) => setThemeDeep("background", { gradientAngle: Number(e.target.value) })}
                className="w-full accent-accent"
              />
            </Field>
          </>
        )}

        {theme.background.type === "image" && (
          <>
            <Field label="Background image">
              <ImageUpload
                value={theme.background.imageUrl}
                onChange={(v) => setThemeDeep("background", { imageUrl: v })}
                aspectRatio={9 / 16}
                folder="themes"
              />
            </Field>
            <Field label="Dark overlay" hint={`${Math.round(theme.background.overlay * 100)}%`}>
              <input
                type="range"
                min={0}
                max={90}
                value={theme.background.overlay * 100}
                onChange={(e) => setThemeDeep("background", { overlay: Number(e.target.value) / 100 })}
                className="w-full accent-accent"
              />
            </Field>
          </>
        )}
      </Panel>

      <Panel title="Typography">
        <Field label="Display font (name)">
          <FontSelect value={theme.font.family} onChange={(v) => setThemeDeep("font", { family: v })} />
        </Field>
        <Field label="Body font (bio & links)">
          <FontSelect value={theme.font.bodyFamily} onChange={(v) => setThemeDeep("font", { bodyFamily: v })} />
        </Field>
        <Field label="Text color">
          <ColorInput value={theme.font.color} onChange={(v) => setThemeDeep("font", { color: v })} />
        </Field>
        <Field label="Muted text color">
          <ColorInput value={theme.font.mutedColor} onChange={(v) => setThemeDeep("font", { mutedColor: v })} />
        </Field>
        <Field label="Size">
          <SegmentedControl
            value={theme.font.size}
            onChange={(v) => setThemeDeep("font", { size: v })}
            options={[
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
            ]}
          />
        </Field>
      </Panel>

      <Panel title="Buttons">
        <Field label="Shape">
          <SegmentedControl
            value={theme.button.shape}
            onChange={(v) => setThemeDeep("button", { shape: v })}
            options={[
              { label: "Sharp", value: "sharp", icon: <Square size={16} /> },
              { label: "Soft", value: "soft", icon: <AppWindow size={16} /> },
              { label: "Pill", value: "pill", icon: <Circle size={16} /> },
            ]}
          />
        </Field>
        <Field label="Fill">
          <SegmentedControl
            value={theme.button.fill}
            onChange={(v) => setThemeDeep("button", { fill: v })}
            options={[
              { label: "Solid", value: "solid", icon: <PaintBucket size={16} /> },
              { label: "Outline", value: "outline", icon: <Layout size={16} /> },
              { label: "Glass", value: "glass", icon: <AppWindow size={16} /> },
            ]}
          />
        </Field>
        <Field label="Background / border color">
          <ColorInput value={theme.button.bgColor} onChange={(v) => setThemeDeep("button", { bgColor: v, borderColor: v })} />
        </Field>
        <Field label="Text color">
          <ColorInput value={theme.button.textColor} onChange={(v) => setThemeDeep("button", { textColor: v })} />
        </Field>
        <Field label="Spacing">
          <SegmentedControl
            value={theme.button.spacing}
            onChange={(v) => setThemeDeep("button", { spacing: v })}
            options={[
              { label: "Compact", value: "compact" },
              { label: "Normal", value: "normal" },
              { label: "Roomy", value: "roomy" },
            ]}
          />
        </Field>
        <Field label="Icons">
          <SegmentedControl
            value={theme.button.iconStyle || "none"}
            onChange={(v) => setThemeDeep("button", { iconStyle: v })}
            options={[
              { label: "None", value: "none", icon: <EyeOff size={16} /> },
              { label: "Auto", value: "auto", icon: <Wand2 size={16} /> },
              { label: "Custom", value: "custom", icon: <Smile size={16} /> },
            ]}
          />
        </Field>
      </Panel>

      <Panel title="Layout & motion">
        <Field label="Layout">
          <SegmentedControl
            value={theme.layout}
            onChange={(v) => setTheme({ layout: v })}
            options={[
              { label: "Stack", value: "stack", icon: <AlignJustify size={16} /> },
              { label: "Grid", value: "grid", icon: <Grid size={16} /> },
            ]}
          />
        </Field>
        <Field label="Animation">
          <SegmentedControl
            value={theme.animation}
            onChange={(v) => setTheme({ animation: v })}
            options={[
              { label: "None", value: "none", icon: <Minus size={16} /> },
              { label: "Fade", value: "fade", icon: <Wind size={16} /> },
              { label: "Rise", value: "rise", icon: <ArrowUp size={16} /> },
              { label: "Pop", value: "pop", icon: <Sparkles size={16} /> },
            ]}
          />
        </Field>
        <Field label="Avatar shape">
          <SegmentedControl
            value={theme.avatarShape}
            onChange={(v) => setTheme({ avatarShape: v })}
            options={[
              { label: "Circle", value: "circle", icon: <Circle size={16} /> },
              { label: "Square", value: "square", icon: <Square size={16} /> },
              { label: "Squircle", value: "squircle", icon: <Hexagon size={16} /> },
            ]}
          />
        </Field>
      </Panel>
    </div>
  );
}
