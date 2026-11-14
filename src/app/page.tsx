import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import ProfileRenderer from "@/components/ProfileRenderer";
import { ThemeToggle } from "@/components/ui";
import { THEME_PRESETS } from "@/lib/presets";
import { UserProfile, LinkItem } from "@/lib/types";
import { ArrowRight, Sparkles } from "lucide-react";

const sampleProfile: UserProfile = {
  userId: "demo",
  username: "abek",
  displayName: "Abek Rao",
  bio: "Visual designer & creative director. Shipping minimal, honest software.",
  profilePic: "",
  createdAt: 1700000000000,
  published: true,
};

const sampleLinks: LinkItem[] = [
  { id: "1", title: "Selected Works 2026", url: "#", order: 0, isActive: true },
  { id: "2", title: "Design Systems & Case Studies", url: "#", order: 1, isActive: true },
  { id: "3", title: "Read my Essays", url: "#", order: 2, isActive: true },
  { id: "4", title: "Book an advisory call", url: "#", order: 3, isActive: true },
];

const featured = THEME_PRESETS[0]; // Sage Minimal for the hero

const differentiators = [
  {
    title: "Minimal & Single-Colored",
    body: "Quiet pastel contrast, single-color palettes, and refined typography. No distracting glow, neon borders, or cookie-cutter templates.",
  },
  {
    title: "Real-time Live Studio",
    body: "Every color tweak, button radius adjustment, and reordered link updates instantly in the phone preview. What you see is exactly what visitors get.",
  },
  {
    title: "Curated Starting Directions",
    body: "From organic pastel sage to warm oat paper and clean slate — each preset offers a balanced, professional foundation ready to personalize.",
  },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-canvas text-text transition-colors">
      {/* Top Nav */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2">
          <img src="/blynk.svg" alt="Blynk Logo" className="h-6 w-auto" />
          <span className="font-semibold tracking-tight text-sm" style={{ fontFamily: "var(--font-display)" }}>
            Blynk
          </span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs font-medium text-muted hover:text-text transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-xs font-medium bg-accent text-accent-contrast px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg hover:opacity-90 transition-opacity shadow-xs"
          >
            Claim page
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border border-border text-muted mb-4 sm:mb-6 bg-surface-raised font-mono"
          >
            <Sparkles size={12} className="text-muted" />
            <span>minimal personal micro-websites</span>
          </div>

          <h1
            className="text-3xl xs:text-4xl sm:text-5xl leading-[1.1] font-semibold tracking-tight mb-4 sm:mb-5 text-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your links, <br className="hidden sm:inline" />
            designed with quiet <br className="hidden sm:inline" />
            pastel elegance.
          </h1>

          <p className="text-xs sm:text-sm text-muted mb-6 sm:mb-8 max-w-md leading-relaxed">
            Leave behind generic buttons on chaotic neon gradients. Blynk gives you clean single-colored themes,
            gentle pastel contrast, and a real-time responsive studio that feels organized from the first click.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="bg-accent text-accent-contrast font-medium px-4 sm:px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 hover:opacity-90 transition-opacity shadow-xs active:scale-[0.98]"
            >
              <span>Build your page free</span>
              <ArrowRight size={14} />
            </Link>
            <span
              className="text-xs text-muted font-mono bg-surface-raised border border-border px-2.5 py-1.5 rounded-md"
            >
              blynk.page/yourname
            </span>
          </div>
        </div>

        {/* Live Phone Frame Demo */}
        <div className="flex justify-center pt-2 sm:pt-0">
          <PhoneFrame>
            <ProfileRenderer
              profile={sampleProfile}
              links={sampleLinks}
              theme={{ ...featured.theme, userId: "demo", presetId: featured.id }}
              scale="preview"
            />
          </PhoneFrame>
        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="border-t border-border bg-surface/50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {differentiators.map((d) => (
            <div key={d.title} className="p-4 sm:p-5 rounded-xl border border-border/60 bg-surface shadow-xs">
              <h3
                className="text-sm font-semibold tracking-tight mb-1.5 sm:mb-2 text-text"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {d.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preset Swatches Showcase */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2
            className="text-lg sm:text-xl font-semibold tracking-tight mb-4 sm:mb-6 text-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Single-colored & pastel starting points
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {THEME_PRESETS.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-border p-3 sm:p-4 h-28 flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-0.5"
                style={{
                  background:
                    p.theme.background.type === "gradient"
                      ? `linear-gradient(135deg, ${p.theme.background.color}, ${p.theme.background.color2})`
                      : p.theme.background.color,
                }}
              >
                <div
                  className="text-xs font-semibold"
                  style={{ color: p.theme.font.color, fontFamily: "var(--font-display)" }}
                >
                  {p.name}
                </div>
                <div
                  className="text-[10px] sm:text-[10.5px] leading-snug line-clamp-2"
                  style={{ color: p.theme.font.mutedColor }}
                >
                  {p.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-muted flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
          <span style={{ fontFamily: "var(--font-label)" }}>blynk — minimal link-in-bio</span>
          <span className="text-[11px]">Crafted with Next.js & Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
