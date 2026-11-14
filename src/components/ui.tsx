"use client";

import { ReactNode } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span
          className="text-[11px] font-semibold text-muted tracking-wider uppercase select-none"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {label}
        </span>
        {hint && <span className="text-[11px] text-muted/70">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-surface border border-border rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all ${
        props.className ?? ""
      }`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-surface border border-border rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all resize-none ${
        props.className ?? ""
      }`}
    />
  );
}

const COMMON_PASTELS = [
  "#EAEFE9", // Sage
  "#F7F4EE", // Oat
  "#F2EFF8", // Lavender
  "#EAF0F6", // Sky
  "#F8ECEE", // Blush
  "#F3EFE6", // Sand
  "#17191C", // Charcoal
  "#0F172A", // Slate
];

export function ColorInput({
  value,
  onChange,
  showSwatches = true,
}: {
  value: string;
  onChange: (v: string) => void;
  showSwatches?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-2.5 py-1.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-all">
        <div className="relative w-7 h-7 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-border/80 shrink-0">
          <input
            type="color"
            value={value.startsWith("#") ? value : "#EAEFE9"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#EAEFE9"
          className="flex-1 bg-transparent text-base sm:text-sm font-mono outline-none text-text"
        />
      </div>

      {showSwatches && (
        <div className="flex items-center flex-wrap gap-2 pt-0.5">
          <span className="text-[10px] text-muted mr-0.5 uppercase select-none" style={{ fontFamily: "var(--font-label)" }}>
            Pastels:
          </span>
          {COMMON_PASTELS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full border transition-transform hover:scale-115 active:scale-95 ${
                value.toLowerCase() === c.toLowerCase()
                  ? "border-accent ring-2 ring-accent/30 scale-110"
                  : "border-border/80"
              }`}
              style={{ backgroundColor: c }}
              title={c}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T; icon?: React.ReactNode }[];
}) {
  return (
    <div className="flex bg-surface-raised border border-border rounded-lg p-1 gap-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 sm:py-1.5 px-2 rounded-md transition-all select-none ${
              active
                ? "bg-surface text-text shadow-xs border border-border/60"
                : "text-muted hover:text-text hover:bg-surface/40"
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 p-0.5 ${
        checked ? "bg-accent" : "bg-border"
      }`}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`block w-5 h-5 rounded-full bg-white dark:bg-canvas transition-transform shadow-xs ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function Panel({
  title,
  children,
  action,
  description,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  description?: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 mb-4 sm:mb-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-1 gap-2">
        <h3 className="text-sm font-semibold tracking-tight text-text" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h3>
        {action}
      </div>
      {description && <p className="text-xs text-muted mb-3 sm:mb-4">{description}</p>}
      <div className={description ? "" : "mt-2.5 sm:mt-3"}>{children}</div>
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 gap-0.5 text-muted shrink-0">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`p-1.5 sm:p-1 rounded-md transition-colors ${
          theme === "light" ? "bg-surface-raised text-text shadow-xs" : "hover:text-text"
        }`}
        title="Light mode"
        aria-label="Light mode"
      >
        <Sun size={13} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`p-1.5 sm:p-1 rounded-md transition-colors ${
          theme === "dark" ? "bg-surface-raised text-text shadow-xs" : "hover:text-text"
        }`}
        title="Dark mode"
        aria-label="Dark mode"
      >
        <Moon size={13} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`p-1.5 sm:p-1 rounded-md transition-colors ${
          theme === "system" ? "bg-surface-raised text-text shadow-xs" : "hover:text-text"
        }`}
        title="System preference"
        aria-label="System preference"
      >
        <Monitor size={13} />
      </button>
    </div>
  );
}
