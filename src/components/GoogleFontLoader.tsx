"use client";

import { useEffect } from "react";
import { buildGoogleFontsHref } from "@/lib/fonts";

export default function GoogleFontLoader({
  display,
  body,
}: {
  display: string;
  body: string;
}) {
  useEffect(() => {
    const href = buildGoogleFontsHref(display, body);
    const id = "dynamic-profile-fonts";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }, [display, body]);

  return null;
}
