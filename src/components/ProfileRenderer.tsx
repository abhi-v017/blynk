import { UserProfile, LinkItem, ThemeConfig } from "@/lib/types";
import GoogleFontLoader from "./GoogleFontLoader";

function backgroundStyle(theme: ThemeConfig): React.CSSProperties {
  const bg = theme.background;
  if (bg.type === "color") return { background: bg.color };
  if (bg.type === "gradient")
    return {
      background: `linear-gradient(${bg.gradientAngle}deg, ${bg.color}, ${bg.color2})`,
    };
  return {
    backgroundImage: bg.imageUrl ? `url(${bg.imageUrl})` : undefined,
    backgroundColor: bg.color,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function buttonRadius(shape: ThemeConfig["button"]["shape"]) {
  if (shape === "sharp") return "0px";
  if (shape === "pill") return "999px";
  return "14px";
}

function buttonStyle(theme: ThemeConfig): React.CSSProperties {
  const b = theme.button;
  const radius = buttonRadius(b.shape);
  if (b.fill === "outline") {
    return {
      background: "transparent",
      color: b.textColor,
      border: `1.5px solid ${b.borderColor}`,
      borderRadius: radius,
    };
  }
  if (b.fill === "glass") {
    return {
      background: "rgba(255,255,255,0.10)",
      color: b.textColor,
      border: "1px solid rgba(255,255,255,0.25)",
      backdropFilter: "blur(10px)",
      borderRadius: radius,
    };
  }
  return {
    background: b.bgColor,
    color: b.textColor,
    border: `1px solid ${b.bgColor}`,
    borderRadius: radius,
  };
}

function spacingGap(spacing: ThemeConfig["button"]["spacing"]) {
  if (spacing === "compact") return "8px";
  if (spacing === "roomy") return "18px";
  return "12px";
}

function fontSizeScale(size: ThemeConfig["font"]["size"]) {
  if (size === "sm") return { name: 20, body: 13, link: 14 };
  if (size === "lg") return { name: 30, body: 16, link: 17 };
  return { name: 24, body: 14.5, link: 15.5 };
}

function avatarRadius(shape: ThemeConfig["avatarShape"]) {
  if (shape === "square") return "10%";
  if (shape === "squircle") return "28%";
  return "50%";
}

function animName(a: ThemeConfig["animation"]) {
  if (a === "fade") return "fadeInUp";
  if (a === "rise") return "riseIn";
  if (a === "pop") return "popIn";
  return "none";
}

function getFaviconUrl(url: string) {
  if (!url) return null;
  try {
    const validUrl = url.startsWith("http") ? url : `https://${url}`;
    const hostname = new URL(validUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

export default function ProfileRenderer({
  profile,
  links,
  theme,
  scale = "full",
}: {
  profile: UserProfile;
  links: LinkItem[];
  theme: ThemeConfig;
  /** "full" for the real public page, "preview" for the compact phone-frame mock */
  scale?: "full" | "preview";
}) {
  const sizes = fontSizeScale(theme.font.size);
  const activeLinks = links.filter((l) => l.isActive).sort((a, b) => a.order - b.order);
  const anim = animName(theme.animation);

  return (
    <div
      className="w-full flex flex-col items-center relative"
      style={{
        fontFamily: `"${theme.font.bodyFamily}", ui-sans-serif, sans-serif`,
        color: theme.font.color,
        minHeight: scale === "full" ? "100vh" : "100%",
        overflowY: "auto",
      }}
    >
      <GoogleFontLoader display={theme.font.family} body={theme.font.bodyFamily} />
      
      {/* Background Layer */}
      <div 
        className={`${scale === "full" ? "fixed" : "absolute"} inset-0 z-0 pointer-events-none ${theme.background.type === "image" && scale === "full" ? "md:blur-2xl md:scale-110" : ""}`}
        style={backgroundStyle(theme)} 
      />
      {theme.background.type === "image" && (
        <div
          className={`${scale === "full" ? "fixed" : "absolute"} inset-0 z-0 pointer-events-none`}
          style={{ background: `rgba(0,0,0,${theme.background.overlay})` }}
        />
      )}

      {/* Main Content Container */}
      <div
        className={`relative z-10 w-full flex-1 flex flex-col items-center overflow-x-hidden ${
          scale === "full" ? "md:flex-none md:w-[400px] md:h-[min(850px,calc(100vh-6rem))] md:my-12 md:overflow-y-auto md:shadow-2xl md:rounded-[2.5rem] md:border md:border-white/10" : ""
        }`}
        style={{ maxWidth: scale === "preview" ? "100%" : undefined }}
      >
        {/* Sharp background inside the card (Desktop only) */}
        {scale === "full" && (
          <>
            <div className="hidden md:block absolute inset-0 z-0 pointer-events-none" style={backgroundStyle(theme)} />
            {theme.background.type === "image" && (
              <div className="hidden md:block absolute inset-0 z-0 pointer-events-none" style={{ background: `rgba(0,0,0,${theme.background.overlay})` }} />
            )}
          </>
        )}

        <div className="relative z-10 w-full flex-1 flex flex-col items-center px-6" style={{ paddingTop: scale === "preview" ? 28 : 56, paddingBottom: 40 }}>
          <div
            className="overflow-hidden bg-black/20 flex items-center justify-center shrink-0"
            style={{
              width: scale === "preview" ? 64 : 88,
              height: scale === "preview" ? 64 : 88,
              borderRadius: avatarRadius(theme.avatarShape),
              border: `2px solid ${theme.font.color}22`,
              animation: anim !== "none" ? `${anim} 0.5s ease both` : undefined,
            }}
          >
            {profile.profilePic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profilePic} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontFamily: `"${theme.font.family}"`, fontSize: sizes.name * 0.7 }}>
                {profile.displayName?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>

          <h1
            className="mt-3 font-semibold text-center"
            style={{
              fontFamily: `"${theme.font.family}"`,
              fontSize: sizes.name,
              animation: anim !== "none" ? `${anim} 0.5s ease 0.05s both` : undefined,
            }}
          >
            {profile.displayName || "Your Name"}
          </h1>

          {profile.bio && (
            <p
              className="mt-1.5 text-center leading-snug"
              style={{
                color: theme.font.mutedColor,
                fontSize: sizes.body,
                maxWidth: 340,
                animation: anim !== "none" ? `${anim} 0.5s ease 0.1s both` : undefined,
              }}
            >
              {profile.bio}
            </p>
          )}

          <div
            className={`w-full mt-6 ${theme.layout === "grid" ? "grid grid-cols-2" : "flex flex-col"}`}
            style={{ gap: spacingGap(theme.button.spacing) }}
          >
            {activeLinks.length === 0 && (
              <p style={{ color: theme.font.mutedColor, fontSize: sizes.body }} className="text-center col-span-2 mt-4">
                No links yet — add some in the dashboard.
              </p>
            )}
            {activeLinks.map((link, i) => (
              <a
                key={link.id}
                href={link.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center font-medium px-5 py-3.5 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  ...buttonStyle(theme),
                  fontSize: sizes.link,
                  animation: anim !== "none" ? `${anim} 0.45s ease ${0.05 * i + 0.12}s both` : undefined,
                }}
              >
                {theme.button.iconStyle === "auto" && getFaviconUrl(link.url) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getFaviconUrl(link.url)!}
                    alt=""
                    className="w-[1.15em] h-[1.15em] rounded-sm object-contain"
                  />
                )}
                {theme.button.iconStyle === "custom" && link.icon && (
                  <span className="text-[1.15em] leading-none">{link.icon}</span>
                )}
                <span>{link.title || link.url}</span>
              </a>
            ))}
          </div>

          <div className="mt-auto pt-10 opacity-40" style={{ fontSize: 11, fontFamily: "var(--font-label)" }}>
            blynk.page/{profile.username}
          </div>
        </div>
      </div>
    </div>
  );
}
