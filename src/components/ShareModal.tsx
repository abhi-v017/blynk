"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { X, Copy, Check } from "lucide-react";

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

  if (!isOpen) return null;

  // Assuming the app runs on localhost during dev or a custom domain in prod
  // Fallback to window.location.origin if available, otherwise just use blynk.page for display
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-canvas w-full max-w-sm rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-text font-display">Share your page</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-xl">
            <QRCode
              value={url}
              size={180}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="M"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-medium text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-label)" }}>
              Public Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text outline-none"
              />
              <button
                onClick={handleCopy}
                className="bg-accent text-canvas px-3 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center transition-opacity hover:opacity-90 w-24 shrink-0"
              >
                {copied ? <Check size={16} /> : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
