"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { TextInput, ThemeToggle } from "@/components/ui";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/dashboard/profile");
    } catch {
      setError("Couldn't sign in. Please verify your email and password.");
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
            Welcome back
          </h1>
          <p className="text-xs text-muted mb-4 sm:mb-5">Sign in to edit and manage your bio page.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
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
                Password
              </label>
              <TextInput
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-xs text-rose-500 pt-1">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent text-accent-contrast font-medium rounded-lg py-2.5 text-xs hover:opacity-90 transition-opacity disabled:opacity-50 mt-2 shadow-xs active:scale-[0.99]"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-muted mt-5 text-center">
            Don&apos;t have a page yet?{" "}
            <Link href="/register" className="text-text underline hover:opacity-80 font-medium">
              Claim yours
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
