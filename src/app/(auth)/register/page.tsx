"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { claimUsernameAndCreateProfile, isUsernameAvailable } from "@/lib/firestore";
import { TextInput, ThemeToggle } from "@/components/ui";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const usernameValid = /^[a-z0-9_]{3,20}$/.test(username);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!usernameValid) {
      setError("Username must be 3-20 characters: lowercase letters, numbers, underscores.");
      return;
    }
    setSubmitting(true);
    try {
      const available = await isUsernameAvailable(username);
      if (!available) {
        setError("That username is taken. Try another.");
        setSubmitting(false);
        return;
      }
      const user = await signUp(email, password);
      await claimUsernameAndCreateProfile(user.uid, username, displayName);
      router.push("/dashboard/profile");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message === "USERNAME_TAKEN" ? "That username is taken. Try another." : message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-canvas text-text flex items-center justify-center p-4 py-8 transition-colors">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <Link href="/" className="text-xs text-muted hover:text-text transition-colors p-1">
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="bg-surface border border-border p-5 sm:p-6 rounded-2xl shadow-xs">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight mb-1 text-text" style={{ fontFamily: "var(--font-display)" }}>
            Claim your page
          </h1>
          <p className="text-xs text-muted mb-4 sm:mb-5">Create a clean, minimal personal micro-website.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-label)" }}>
                Display Name
              </label>
              <TextInput
                placeholder="Jane Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-label)" }}>
                Handle / URL
              </label>
              <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-all">
                <span className="pl-3 text-xs text-muted font-mono select-none">
                  blynk.page/
                </span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="yourname"
                  required
                  className="flex-1 bg-transparent py-2.5 sm:py-2 pr-3 text-base sm:text-sm font-mono outline-none text-text placeholder:text-muted/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-label)" }}>
                Email
              </label>
              <TextInput
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-label)" }}>
                Password (min 6 chars)
              </label>
              <TextInput
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && <p className="text-xs text-rose-500 pt-1">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent text-accent-contrast font-medium rounded-lg py-2.5 text-xs hover:opacity-90 transition-opacity disabled:opacity-50 mt-2 shadow-xs active:scale-[0.99]"
            >
              {submitting ? "Creating your page…" : "Create my page"}
            </button>
          </form>

          <p className="text-xs text-muted mt-5 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-text underline hover:opacity-80 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
