import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import ProfileRenderer from "@/components/ProfileRenderer";
import { THEME_PRESETS } from "@/lib/presets";
import { UserProfile, LinkItem } from "@/lib/types";

const sampleProfile: UserProfile = {
  userId: "demo",
  username: "abek",
  displayName: "Abek Rao",
  bio: "Motion designer. Shipping something new most weeks.",
  profilePic: "",
  createdAt: Date.now(),
  published: true,
};

const sampleLinks: LinkItem[] = [
  { id: "1", title: "Portfolio", url: "#", order: 0, isActive: true },
  { id: "2", title: "Latest short film", url: "#", order: 1, isActive: true },
  { id: "3", title: "Instagram", url: "#", order: 2, isActive: true },
  { id: "4", title: "Book a call", url: "#", order: 3, isActive: true },
];

const featured = THEME_PRESETS[2]; // Citrus Pop for the hero mockup

const differentiators = [
  {
    title: "Not a template",
    body: "Background, type, buttons, layout, motion — every layer is yours to shape, not a color swap on someone else's design.",
  },
  {
    title: "Live, not eventual",
    body: "Every change reflects on the phone mock instantly. What you see while editing is exactly what visitors get.",
  },
  {
    title: "Built to be shown off",
    body: "Five starting points, from paper-and-ink minimal to terminal green — each a real direction, not a filter.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-text">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/blynk.svg" alt="Blynk Logo" className="h-7 w-auto" />
          <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Blynk</span>
        </div>
        <nav className="flex items-center gap-5">
          <Link href="/login" className="text-sm text-muted hover:text-text transition-colors">Sign in</Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-accent text-canvas px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Claim your page
          </Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div
            className="inline-block text-xs px-2.5 py-1 rounded-full border border-border text-muted mb-5"
            style={{ fontFamily: "var(--font-label)" }}
          >
            not another link list
          </div>
          <h1
            className="text-5xl leading-[1.05] font-semibold mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your links,<br />designed like<br />they&apos;re yours.
          </h1>
          <p className="text-base text-muted mb-8 max-w-md leading-relaxed">
            Every link-in-bio tool gives you the same rounded card on the same gradient.
            Blynk gives you a real canvas — background, type, buttons, motion — and a
            live preview that updates as you touch it.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="bg-accent text-canvas font-medium px-5 py-3 rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Build your page — free
            </Link>
            <span className="text-xs text-muted" style={{ fontFamily: "var(--font-label)" }}>
              blynk.page/yourname
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <PhoneFrame>
            <ProfileRenderer profile={sampleProfile} links={sampleLinks} theme={{ ...featured.theme, userId: "demo", presetId: featured.id }} scale="preview" />
          </PhoneFrame>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
          {differentiators.map((d) => (
            <div key={d.title}>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {d.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Five starting points. Infinite ways from there.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {THEME_PRESETS.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-border p-4 h-32 flex flex-col justify-end"
                style={{
                  background:
                    p.theme.background.type === "gradient"
                      ? `linear-gradient(135deg, ${p.theme.background.color}, ${p.theme.background.color2})`
                      : p.theme.background.color,
                }}
              >
                <div
                  className="text-sm font-semibold"
                  style={{ color: p.theme.font.color, fontFamily: "var(--font-display)" }}
                >
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-muted flex justify-between">
          <span style={{ fontFamily: "var(--font-label)" }}>blynk — a personal micro-website builder</span>
          <span>built with Next.js, Tailwind, Firebase</span>
        </div>
      </footer>
    </div>
  );
}
