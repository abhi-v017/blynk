"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useEditorStore } from "@/lib/editor-store";
import { getUserProfile, getLinks, getTheme, updateUserProfile, saveTheme } from "@/lib/firestore";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import PhoneFrame from "@/components/PhoneFrame";
import ProfileRenderer from "@/components/ProfileRenderer";
import ShareModal from "@/components/ShareModal";
import { User, Link2, Palette, ExternalLink, LogOut, Share } from "lucide-react";

const TABS = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/theme", label: "Theme", icon: Palette },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, links, theme, hydrate } = useEditorStore();
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, l, t] = await Promise.all([
        getUserProfile(user.uid),
        getLinks(user.uid),
        getTheme(user.uid),
      ]);
      if (p && t) hydrate(p, l, t);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useDebouncedEffect(() => {
    if (!user || !profile || !theme || !ready) return;
    setSaveState("saving");
    Promise.all([
      updateUserProfile(user.uid, {
        displayName: profile.displayName,
        bio: profile.bio,
        profilePic: profile.profilePic,
      }),
      saveTheme(user.uid, theme),
    ]).then(() => setSaveState("saved"));
  }, [profile, theme]);

  if (loading || !user || !ready || !profile || !theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-muted text-sm" style={{ fontFamily: "var(--font-label)" }}>
        loading studio…
      </div>
    );
  }

  return (
    <div className="h-screen bg-canvas flex flex-col overflow-hidden">
      <header className="border-b border-border px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <img src="/blynk.svg" alt="Blynk Logo" className="h-6 w-auto" />
          <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Blynk Studio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="text-xs text-muted flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-label)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: saveState === "saving" ? "#FFC93C" : "var(--mint)" }}
            />
            {saveState === "saving" ? "saving…" : saveState === "saved" ? "all changes saved" : "draft"}
          </span>
          <button
            onClick={() => setIsShareOpen(true)}
            className="text-xs flex items-center gap-1 bg-surface border border-border px-2 py-1 rounded text-text hover:border-muted transition-colors"
          >
            <Share size={12} /> Share
          </button>
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="text-xs flex items-center gap-1 text-muted hover:text-text transition-colors"
          >
            view live <ExternalLink size={13} />
          </Link>
          <button
            onClick={() => signOut()}
            className="text-xs flex items-center gap-1 text-muted hover:text-text transition-colors"
          >
            <LogOut size={13} /> sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-56 border-r border-border p-4 shrink-0 hidden md:block">
          <nav className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? "bg-surface text-text" : "text-muted hover:text-text hover:bg-surface/60"
                  }`}
                >
                  <Icon size={16} strokeWidth={2} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 px-3">
            <div className="text-[11px] text-muted/70 mb-1" style={{ fontFamily: "var(--font-label)" }}>
              your page
            </div>
            <div className="text-sm text-accent truncate" style={{ fontFamily: "var(--font-label)" }}>
              /{profile.username}
            </div>
          </div>
        </aside>

        {/* mobile tabs */}
        <nav className="md:hidden flex border-b border-border">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 text-center py-3 text-xs ${active ? "text-accent border-b-2 border-accent" : "text-muted"}`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-xl">{children}</div>
        </main>

        <section className="w-[380px] border-l border-border shrink-0 hidden lg:flex flex-col items-center justify-start pt-12 bg-[#08090b] p-8">
          <div className="text-[11px] text-muted mb-4 tracking-wide uppercase" style={{ fontFamily: "var(--font-label)" }}>
            live preview
          </div>
          <PhoneFrame>
            <ProfileRenderer profile={profile} links={links} theme={theme} scale="preview" />
          </PhoneFrame>
        </section>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        username={profile.username}
      />
    </div>
  );
}
