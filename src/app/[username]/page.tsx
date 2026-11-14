"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getUserByUsername, getLinks, getTheme } from "@/lib/firestore";
import { UserProfile, LinkItem, ThemeConfig } from "@/lib/types";
import ProfileRenderer from "@/components/ProfileRenderer";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "not-found" }
    | { status: "ready"; profile: UserProfile; links: LinkItem[]; theme: ThemeConfig }
  >({ status: "loading" });

  useEffect(() => {
    (async () => {
      const profile = await getUserByUsername(params.username);
      if (!profile || !profile.published) {
        setState({ status: "not-found" });
        return;
      }
      const [links, theme] = await Promise.all([getLinks(profile.userId), getTheme(profile.userId)]);
      if (!theme) {
        setState({ status: "not-found" });
        return;
      }
      setState({ status: "ready", profile, links, theme });
    })();
  }, [params.username]);

  if (state.status === "loading") {
    return (
      <div className="min-h-[100dvh] bg-canvas flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <div className="min-h-[100dvh] bg-canvas flex flex-col items-center justify-center text-text px-6 text-center">
        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-4 text-xs font-mono">
          404
        </div>
        <h1 className="text-lg font-semibold mb-1 text-text" style={{ fontFamily: "var(--font-display)" }}>
          Page not found
        </h1>
        <p className="text-xs text-muted mb-6">
          No one has claimed <span className="font-mono text-text bg-surface px-1 py-0.5 rounded border border-border">/{params.username}</span> yet.
        </p>
        <Link
          href="/"
          className="text-xs bg-surface border border-border px-3.5 py-1.5 rounded-lg text-text hover:bg-surface-raised transition-colors"
        >
          Build your own page on Blynk →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      <ProfileRenderer profile={state.profile} links={state.links} theme={state.theme} scale="full" />
    </div>
  );
}
