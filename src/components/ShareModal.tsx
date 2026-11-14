"use client";

import { useState, useSyncExternalStore } from "react";
import QRCode from "react-qr-code";
import { X, Copy, Check, Share } from "lucide-react";

const emptySubscribe = () => () => {};
const getNativeShareSnapshot = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";
const getServerShareSnapshot = () => false;

export default function ShareModal({
  isOpen,
  onClose,
  username,
}: {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}) {
  const [copied, setCopied] = useState(false);
  const hasNativeShare = useSyncExternalStore(
    emptySubscribe,
    getNativeShareSnapshot,
    getServerShareSnapshot
  );

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://blynk.page";
  const url = `${origin}/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${username}'s Blynk Page`,
        text: `Check out my links and personal micro-website on Blynk!`,
        url: url,
      });
    } catch {
      // User cancelled or share failed, ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border">
          <h3 className="font-semibold text-text text-sm tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Share your page
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors p-1.5 rounded-md"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-5">
          <div className="bg-white p-3 rounded-xl border border-border/80 shadow-xs">
            <QRCode
              value={url}
              size={150}
              bgColor="#FFFFFF"
              fgColor="#17191C"
              level="M"
            />
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold text-muted uppercase tracking-wider"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Public Link
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-surface-raised border border-border rounded-lg px-2.5 sm:px-3 py-2 text-xs font-mono text-text outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="bg-accent text-accent-contrast px-3 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95 shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={13} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Android / Mobile Native Share Button */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full bg-surface-raised border border-border hover:bg-surface-hover text-text font-medium py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Share size={13} />
              <span>Share via Apps (WhatsApp, etc.)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
