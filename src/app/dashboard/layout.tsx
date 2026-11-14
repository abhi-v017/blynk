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
import { ThemeToggle } from "@/components/ui";
import {
  User,
  Link2,
  Palette,
  ExternalLink,
  LogOut,
  Share2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Smartphone,
  Maximize2,
  SmartphoneNfc,
} from "lucide-react";

const NAV_TABS = [
  { href: "/dashboard/profile", id: "profile", label: "Profile", icon: User },
  { href: "/dashboard/links", id: "links", label: "Links", icon: Link2 },
  { href: "/dashboard/theme", id: "theme", label: "Theme", icon: Palette },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, links, theme, hydrate } = useEditorStore();
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [mobilePreviewMode, setMobilePreviewMode] = useState<"frame" | "fullscreen">("frame");
  const [copiedLink, setCopiedLink] = useState(false);

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

  const copyProfileUrl = () => {
    if (!profile) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://blynk.page";
    navigator.clipboard.writeText(`${origin}/${profile.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleMobileNav = (href: string) => {
    setMobileTab("edit");
    router.push(href);
  };

  if (loading || !user || !ready || !profile || !theme) {
    return (
      <div
        className="h-[100dvh] flex items-center justify-center bg-canvas text-muted text-xs tracking-wider uppercase"
        style={{ fontFamily: "var(--font-label)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          Loading studio…
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-canvas text-text flex flex-col overflow-hidden transition-colors">
      {/* Top Header - Mobile and Tablet Optimized */}
      <header className="border-b border-border bg-surface px-3 sm:px-6 py-2.5 flex items-center justify-between shrink-0 z-30 transition-colors">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 select-none">
            <img src="/blynk.svg" alt="Blynk Logo" className="h-6 w-auto" />
            <span className="font-semibold text-sm tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Blynk
            </span>
          </Link>
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-raised border border-border text-muted font-medium hidden sm:inline-block">
            Studio
          </span>
        </div>

        {/* Right: Actions, Theme, Status */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Save Status (Dot on mobile, label on sm+) */}
          <div
            className="text-[11px] text-muted flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-raised/70 border border-border/60 shrink-0"
            style={{ fontFamily: "var(--font-label)" }}
            title={saveState === "saving" ? "Saving changes..." : "All changes saved"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                saveState === "saving" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="hidden sm:inline">
              {saveState === "saving" ? "saving…" : "saved"}
            </span>
          </div>

          {/* Desktop/Tablet Preview Pane Toggle */}
          <button
            onClick={() => setShowPreviewPane(!showPreviewPane)}
            className="hidden lg:flex items-center gap-1.5 text-xs text-muted hover:text-text bg-surface-raised border border-border px-2.5 py-1.5 rounded-lg transition-colors"
            title={showPreviewPane ? "Hide preview" : "Show preview"}
          >
            {showPreviewPane ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="hidden xl:inline">{showPreviewPane ? "Hide Preview" : "Show Preview"}</span>
          </button>

          {/* Theme Toggle (Light / Dark / System) */}
          <ThemeToggle />

          {/* Share Modal Trigger */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1 text-xs font-medium bg-surface-raised border border-border p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-text hover:bg-surface-hover transition-colors shadow-xs"
            title="Share page"
            aria-label="Share page"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* View Live */}
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="flex items-center gap-1 text-xs font-medium bg-accent text-accent-contrast p-2 sm:px-3 sm:py-1.5 rounded-lg hover:opacity-90 transition-opacity shadow-xs"
            title="Open public page"
            aria-label="Visit public bio page"
          >
            <span className="hidden sm:inline">Visit</span>
            <ExternalLink size={12} />
          </Link>

          {/* Sign Out */}
          <button
            onClick={() => signOut()}
            className="text-muted hover:text-text p-2 sm:p-1.5 rounded-lg hover:bg-surface-raised transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Navigation Sidebar (Tablet Rail `w-16` / Desktop Sidebar `w-52 lg:w-56`) */}
        <aside className="w-16 lg:w-56 border-r border-border bg-surface p-2.5 lg:p-4 shrink-0 hidden md:flex flex-col justify-between transition-all">
          <nav className="flex flex-col gap-1.5">
            <div
              className="text-[10px] uppercase font-semibold text-muted tracking-wider px-2 lg:px-3 py-1 mb-0.5 hidden lg:block"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Customize
            </div>
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = pathname === tab.href && mobileTab === "edit";
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMobileTab("edit")}
                  className={`flex items-center justify-center lg:justify-start gap-2.5 p-2.5 lg:px-3 lg:py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-accent text-accent-contrast shadow-xs"
                      : "text-muted hover:text-text hover:bg-surface-raised"
                  }`}
                  title={tab.label}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Address Box (Desktop full, Tablet compact icon) */}
          <div className="p-2 lg:p-3 bg-surface-raised border border-border rounded-xl">
            <div
              className="text-[9px] lg:text-[10px] text-muted uppercase font-semibold tracking-wider mb-1 hidden lg:block"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Public URL
            </div>
            <div className="flex items-center justify-between gap-1 text-xs font-mono text-text">
              <span className="truncate text-accent font-medium hidden lg:inline">/{profile.username}</span>
              <button
                onClick={copyProfileUrl}
                className="w-full lg:w-auto text-muted hover:text-text p-1.5 rounded hover:bg-surface transition-colors flex items-center justify-center"
                title="Copy public profile link"
                aria-label="Copy public profile link"
              >
                {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </aside>

        {/* Central Editor Canvas */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all ${
            mobileTab === "preview" ? "hidden md:block" : "pb-24 md:pb-8"
          }`}
        >
          <div className="max-w-xl mx-auto">{children}</div>
        </main>

        {/* Live Preview Section */}
        {/* On Mobile: Displayed when mobileTab === "preview" */}
        {/* On Tablet/Desktop: Shown when showPreviewPane is true */}
        <section
          className={`border-l border-border bg-canvas/60 shrink-0 flex-col items-center justify-start overflow-y-auto transition-all ${
            mobileTab === "preview"
              ? "flex flex-1 w-full p-4 pb-24 pt-4"
              : showPreviewPane
              ? "hidden lg:flex lg:w-[350px] xl:w-[400px] p-4 lg:p-6 xl:p-8"
              : "hidden"
          }`}
        >
          {/* Mobile Preview Controls */}
          <div className="w-full max-w-sm flex items-center justify-between mb-3 md:mb-4 px-2">
            <div
              className="text-[10px] text-muted tracking-wider uppercase font-semibold flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-label)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Preview
            </div>

            {/* Mobile View Mode: Phone Frame vs Full Screen */}
            <div className="flex md:hidden items-center bg-surface border border-border rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setMobilePreviewMode("frame")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  mobilePreviewMode === "frame"
                    ? "bg-accent text-accent-contrast shadow-xs"
                    : "text-muted hover:text-text"
                }`}
                title="Phone Frame view"
              >
                <Smartphone size={12} />
                <span>Frame</span>
              </button>
              <button
                onClick={() => setMobilePreviewMode("fullscreen")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  mobilePreviewMode === "fullscreen"
                    ? "bg-accent text-accent-contrast shadow-xs"
                    : "text-muted hover:text-text"
                }`}
                title="Full Screen view"
              >
                <Maximize2 size={12} />
                <span>Full</span>
              </button>
            </div>
          </div>

          {/* Render Preview according to mobile preference */}
          {mobileTab === "preview" && mobilePreviewMode === "fullscreen" ? (
            <div className="w-full max-w-md min-h-[500px] rounded-2xl overflow-hidden border border-border shadow-md bg-canvas">
              <ProfileRenderer profile={profile} links={links} theme={theme} scale="preview" />
            </div>
          ) : (
            <PhoneFrame>
              <ProfileRenderer profile={profile} links={links} theme={theme} scale="preview" />
            </PhoneFrame>
          )}
        </section>
      </div>

      {/* Mobile Bottom Navigation Bar (< md screens - Android & Small Tablet) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 py-1.5 transition-colors select-none"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href && mobileTab === "edit";
          return (
            <button
              key={tab.id}
              onClick={() => handleMobileNav(tab.href)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors ${
                isActive ? "text-accent font-semibold" : "text-muted hover:text-text"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* 4th Tab: Live Preview */}
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors relative ${
            mobileTab === "preview" ? "text-accent font-semibold" : "text-muted hover:text-text"
          }`}
        >
          <SmartphoneNfc size={18} strokeWidth={mobileTab === "preview" ? 2.4 : 1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">Preview</span>
          {/* Subtle live indicator dot */}
          <span className="absolute top-1 right-[28%] w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </button>
      </nav>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        username={profile.username}
      />
    </div>
  );
}
