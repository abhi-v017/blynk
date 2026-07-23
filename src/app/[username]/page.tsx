"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    return <div className="min-h-screen bg-canvas" />;
  }

  if (state.status === "not-found") {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center text-text px-6">
        <h1 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
          This page doesn&apos;t exist
        </h1>
        <p className="text-sm text-muted">
          No one has claimed <span style={{ fontFamily: "var(--font-label)" }}>/{params.username}</span> yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProfileRenderer profile={state.profile} links={state.links} theme={state.theme} scale="full" />
    </div>
  );
}
