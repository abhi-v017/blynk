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
  return "12px";
}

function isColorDark(hexColor: string) {
  if (!hexColor || !hexColor.startsWith("#")) return false;
  const hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  return false;
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
    const darkBg = isColorDark(theme.background.color);
    return {
      background: darkBg ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.55)",
      color: b.textColor,
      border: darkBg
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid rgba(0, 0, 0, 0.08)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderRadius: radius,
    };
  }

  return {
    background: b.bgColor,
    color: b.textColor,
    border: `1px solid ${b.borderColor || b.bgColor}`,
    borderRadius: radius,
  };
}

function spacingGap(spacing: ThemeConfig["button"]["spacing"]) {
  if (spacing === "compact") return "8px";
  if (spacing === "roomy") return "16px";
  return "12px";
}

function fontSizeScale(size: ThemeConfig["font"]["size"]) {
  if (size === "sm") return { name: 19, body: 13, link: 13.5 };
  if (size === "lg") return { name: 27, body: 15, link: 16 };
  return { name: 23, body: 14, link: 14.5 };
}

function avatarRadius(shape: ThemeConfig["avatarShape"]) {
  if (shape === "square") return "12%";
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
      className="w-full flex flex-col items-center relative transition-colors"
      style={{
        fontFamily: `"${theme.font.bodyFamily}", ui-sans-serif, sans-serif`,
        color: theme.font.color,
        minHeight: scale === "full" ? "100dvh" : "100%",
        overflowY: "auto",
      }}
    >
      <GoogleFontLoader display={theme.font.family} body={theme.font.bodyFamily} />

      {/* Background Layer */}
      <div
        className={`${
          scale === "full" ? "fixed" : "absolute"
        } inset-0 z-0 pointer-events-none ${
          theme.background.type === "image" && scale === "full"
            ? "md:blur-2xl md:scale-105"
            : ""
        }`}
        style={backgroundStyle(theme)}
      />
      {theme.background.type === "image" && (
        <div
          className={`${
            scale === "full" ? "fixed" : "absolute"
          } inset-0 z-0 pointer-events-none`}
          style={{ background: `rgba(0,0,0,${theme.background.overlay})` }}
        />
      )}

      {/* Main Content Container */}
      <div
        className={`relative z-10 w-full flex-1 flex flex-col items-center overflow-x-hidden ${
          scale === "full"
            ? "md:flex-none md:w-[410px] md:h-[min(820px,calc(100dvh-4rem))] md:my-8 md:overflow-y-auto md:shadow-lg md:rounded-[2rem] md:border md:border-black/5 dark:md:border-white/10"
            : ""
        }`}
        style={{ maxWidth: scale === "preview" ? "100%" : undefined }}
      >
        {/* Desktop Card Background */}
        {scale === "full" && (
          <>
            <div
              className="hidden md:block absolute inset-0 z-0 pointer-events-none"
              style={backgroundStyle(theme)}
            />
            {theme.background.type === "image" && (
              <div
                className="hidden md:block absolute inset-0 z-0 pointer-events-none"
                style={{ background: `rgba(0,0,0,${theme.background.overlay})` }}
              />
            )}
          </>
        )}

        <div
          className="relative z-10 w-full flex-1 flex flex-col items-center px-4 sm:px-6"
          style={{
            paddingTop: scale === "preview" ? 28 : 48,
            paddingBottom: 36,
          }}
        >
          {/* Avatar */}
          <div
            className="overflow-hidden bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-xs"
            style={{
              width: scale === "preview" ? 64 : 84,
              height: scale === "preview" ? 64 : 84,
              borderRadius: avatarRadius(theme.avatarShape),
              border: `1.5px solid ${theme.font.color}18`,
              animation: anim !== "none" ? `${anim} 0.4s ease both` : undefined,
            }}
          >
            {profile.profilePic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profilePic}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                style={{
                  fontFamily: `"${theme.font.family}"`,
                  fontSize: sizes.name * 0.75,
                }}
              >
                {profile.displayName?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>

          {/* Display Name */}
          <h1
            className="mt-3 font-semibold text-center tracking-tight px-2 break-words max-w-full"
            style={{
              fontFamily: `"${theme.font.family}"`,
              fontSize: sizes.name,
              animation: anim !== "none" ? `${anim} 0.4s ease 0.05s both` : undefined,
            }}
          >
            {profile.displayName || "Your Name"}
          </h1>

          {/* Bio */}
          {profile.bio && (
            <p
              className="mt-1.5 text-center leading-relaxed px-2 break-words"
              style={{
                color: theme.font.mutedColor,
                fontSize: sizes.body,
                maxWidth: 320,
                animation: anim !== "none" ? `${anim} 0.4s ease 0.1s both` : undefined,
              }}
            >
              {profile.bio}
            </p>
          )}

          {/* Links List */}
          <div
            className={`w-full mt-6 ${
              theme.layout === "grid" ? "grid grid-cols-2" : "flex flex-col"
            }`}
            style={{ gap: spacingGap(theme.button.spacing) }}
          >
            {activeLinks.length === 0 && (
              <p
                style={{ color: theme.font.mutedColor, fontSize: sizes.body }}
                className="text-center col-span-2 mt-4 text-xs opacity-75"
              >
                No active links to display.
              </p>
            )}
            {activeLinks.map((link, i) => (
              <a
                key={link.id}
                href={link.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center font-medium px-3.5 py-3 min-h-[46px] transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 shadow-xs select-none"
                style={{
                  ...buttonStyle(theme),
                  fontSize: sizes.link,
                  animation:
                    anim !== "none"
                      ? `${anim} 0.35s ease ${0.04 * i + 0.1}s both`
                      : undefined,
                }}
              >
                {theme.button.iconStyle === "auto" && getFaviconUrl(link.url) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getFaviconUrl(link.url)!}
                    alt=""
                    className="w-[1.1em] h-[1.1em] rounded-xs object-contain shrink-0"
                  />
                )}
                {theme.button.iconStyle === "custom" && link.icon && (
                  <span className="text-[1.1em] leading-none shrink-0">{link.icon}</span>
                )}
                <span className="truncate">{link.title || link.url}</span>
              </a>
            ))}
          </div>

          {/* Footer Badge */}
          <div
            className="mt-auto pt-8 opacity-40 text-center"
            style={{ fontSize: 11, fontFamily: "var(--font-label)" }}
          >
            blynk.page/{profile.username}
          </div>
        </div>
      </div>
    </div>
  );
}
